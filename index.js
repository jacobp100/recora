// @flow
import {
  __, startsWith, last, get, map, flatMap, mapValues, flow, assign, includes, sortBy,
} from 'lodash/fp';

const OPERATOR_EXPONENT = 'exponent';
const OPERATOR_MULTIPLY = 'multiply';
const OPERATOR_DIVIDE = 'divide';
const OPERATOR_ADD = 'add';
const OPERATOR_SUBTRACT = 'subtract';
const OPERATOR_MODULO = 'modulo';

type TokenType = string;

const TOKEN_OPERATOR: TokenType = 'operator';
const TOKEN_NUMBER: TokenType = 'number';
const TOKEN_UNIT: TokenType = 'unit';
const TOKEN_COLOR: TokenType = 'color';
const TOKEN_NOOP: TokenType = 'noop';
const TOKEN_VECTOR_START: TokenType = 'vector-start';
const TOKEN_VECTOR_SEPARATOR: TokenType = 'vector-separator';
const TOKEN_VECTOR_END: TokenType = 'vector-end';

type Token = { type: TokenType, value?: any, start?: number, end?: number };

type TokenMatcher = (RegExp | string);
type TokenTransform = (token: string) => ?Token;
type Transform = {
  match: TokenMatcher,
  penalty: number,
  token?: TokenTransform | Token,
  push?: string[],
  pop?: boolean | number,
};
type TransformRef = {
  ref: string,
  match?: TokenMatcher,
  penalty?: number,
  token?: TokenTransform | Token,
  push?: string[],
  pop?: boolean | number,
}

type TokenizerSpec = ({ [key:string]: (Transform | TransformRef)[] });
type TokenizerState = {
  character: number,
  stack: string[],
  penalty: number,
  remainingText: string,
  tokens: Token[],
};

const defaultState = {
  character: 0,
  stack: ['default'],
  penalty: 0,
  remainingText: '',
  tokens: [],
};
const createTokenizer = (inputSpec: TokenizerSpec) => {
  const flattenRefs = flatMap(option => (
    !option.ref
      ? option
      : flow(
        flattenRefs,
        map(assign(__, option)),
      )(inputSpec[option.ref])
  ));
  const spec = mapValues(flattenRefs, inputSpec);

  function* tokenizer(state: TokenizerState) {
    const { remainingText } = state;

    if (remainingText.length === 0) {
      yield { tokens: state.tokens, penalty: state.penalty };
      return;
    }

    const options = get(last(state.stack), spec);

    /* eslint-disable no-continue */
    for (const option of options) {
      const { match: matchSpec } = option;
      let matchedText: ?string = null;

      if (typeof matchSpec === 'string') {
        matchedText = startsWith(matchSpec, remainingText) ? matchSpec : null;
      } else if (matchSpec instanceof RegExp) {
        const regexMatch = remainingText.search(matchSpec) === 0 && remainingText.match(matchSpec);
        matchedText = regexMatch ? regexMatch[0] : null;
      }

      if (!matchedText) continue;

      const token = typeof option.token === 'function'
        ? option.token(matchedText)
        : option.token;

      if (token === null) continue;

      const end = state.character + matchedText.length;
      const tokens = token
        // ? [...state.tokens, { ...token, start: state.character, end }]
        ? [...state.tokens, token]
        : state.tokens;

      let stack = state.stack;
      if (typeof option.pop === 'boolean') stack = stack.slice(0, -1);
      if (typeof option.pop === 'number') stack = stack.slice(0, -option.pop);
      if (option.push) stack = stack.concat(option.push);

      yield* tokenizer({
        penalty: state.penalty + option.penalty,
        remainingText: remainingText.substring(matchedText.length),
        character: end,
        stack,
        tokens,
      });
    }
  }
  /* eslint-enable */


  return text => {
    let results = [];
    for (const result of tokenizer({ ...defaultState, remainingText: text })) {
      results.push(result);
    }
    results = flow(
      sortBy('penalty'),
      map('tokens')
    )(results);
    return results;
  };
};

const twoWordUnits = ['degrees celsius', 'degree celsius'];
const oneWordUnits = ['meters', 'meter', 'yard', 'yards', 'inches'];

/* eslint-disable max-len */
const tokenizer = createTokenizer({
  number: [
    { match: /\d+/, token: token => ({ type: TOKEN_NUMBER, value: Number(token) }), penalty: -1000 },
  ],
  operator: [
    { match: '**', token: { type: TOKEN_OPERATOR, value: OPERATOR_EXPONENT }, penalty: -1000 },
    { match: '^', token: { type: TOKEN_OPERATOR, value: OPERATOR_EXPONENT }, penalty: -1000 },
    { match: /\*(?!\*)/, token: { type: TOKEN_OPERATOR, value: OPERATOR_MULTIPLY }, penalty: -1000 },
    { match: '/', token: { type: TOKEN_OPERATOR, value: OPERATOR_DIVIDE }, penalty: -1000 },
    { match: '+', token: { type: TOKEN_OPERATOR, value: OPERATOR_ADD }, penalty: -1000 },
    { match: '-', token: { type: TOKEN_OPERATOR, value: OPERATOR_SUBTRACT }, penalty: -1000 },
    { match: '%', token: { type: TOKEN_OPERATOR, value: OPERATOR_MODULO }, penalty: -1000 },
  ],
  unit: [
    {
      match: /[a-z]+\s+[a-z]+/i,
      token: token => (includes(token, twoWordUnits) ? ({ type: TOKEN_UNIT, value: token }) : null),
      penalty: -120,
    },
    {
      match: /[a-z]+/i,
      token: token => (includes(token, oneWordUnits) ? ({ type: TOKEN_UNIT, value: token }) : null),
      penalty: -100,
    },
  ],
  color: [
    { match: /#[0-9a-f]{3,8}/, token: token => ({ type: TOKEN_COLOR, value: token }), penalty: -500 },
  ],
  noop: [
    { match: /[a-z]+/i, token: { type: TOKEN_NOOP }, penalty: 10 },
  ],
  whitespace: [
    { match: /\s+/, penalty: 0 },
  ],
  otherCharacter: [
    // No numbers, whitespace, or operators (the less this catches, the better the perf)
    { match: /[^\w\s*^/+\-%]/, penalty: 1000 },
  ],
  vectorComma: [
    { match: ',', token: { type: TOKEN_VECTOR_SEPARATOR }, penalty: 0, pop: true },
    { ref: 'vectorMisc' },
  ],
  vectorNumber: [
    { ref: 'number', push: ['vectorComma'] },
    { ref: 'vectorMisc' },
  ],
  vectorMisc: [
    { match: ']', token: { type: TOKEN_VECTOR_END }, penalty: 0, pop: true },
    { ref: 'whitespace' },
  ],
  vector: [
    { match: '[', token: { type: TOKEN_VECTOR_START }, penalty: -500, push: ['vectorNumber'] },
  ],
  default: [
    { ref: 'operator' },
    { ref: 'number' },
    { ref: 'unit' },
    { ref: 'color' },
    { ref: 'vector' },
    { ref: 'noop' },
    { ref: 'whitespace' },
    { ref: 'otherCharacter' },
  ],
});
/* eslint-enable */

const input = '1 meter + 1 yard to inches';
console.time('first run');
console.log(tokenizer(input));
console.timeEnd('first run');
console.time('second run');
tokenizer(input);
console.timeEnd('second run');
console.time('third run');
tokenizer(input);
console.timeEnd('third run');
