// @flow
import {
  __, startsWith, last, get, map, flatMap, mapValues, flow, assign, sortBy, has, curry, join,
  range,
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
const TOKEN_UNIT_NAME: TokenType = 'unit-name';
const TOKEN_UNIT_PREFIX: TokenType = 'unit-prefix';
const TOKEN_UNIT_SUFFIX: TokenType = 'unit-suffix';
const TOKEN_OPEN_BRAKET: TokenType = 'open-bracket';
const TOKEN_CLOSE_BRAKET: TokenType = 'close-bracket';
const TOKEN_COLOR: TokenType = 'color';
const TOKEN_NOOP: TokenType = 'noop';
const TOKEN_VECTOR_START: TokenType = 'vector-start';
const TOKEN_VECTOR_SEPARATOR: TokenType = 'vector-separator';
const TOKEN_VECTOR_END: TokenType = 'vector-end';

type Token = { type: TokenType, value?: any, start?: number, end?: number };

type TokenTransform = (token: string) => ?Token;
type TokenizerSpecEntry = {
  match: RegExp | string,
  penalty: number,
  token?: TokenTransform | ?Token,
  push?: string[],
  pop?: boolean | number,
  updateState?: (state: Object) => Object
};
type TokenizerSpecEntryRef = {
  ref: string,
  match?: RegExp | string,
  penalty?: number,
  token?: TokenTransform | ?Token,
  push?: string[],
  pop?: boolean | number,
  updateState?: (state: Object) => Object
}

type TokenizerSpec = ({ [key:string]: (TokenizerSpecEntry | TokenizerSpecEntryRef)[] });
type TokenizerState = {
  character: number,
  stack: string[],
  penalty: number,
  remainingText: string,
  tokens: Token[],
};

const defaultTokenizerState = {
  character: 0,
  stack: ['default'],
  penalty: 0,
  remainingText: '',
  tokens: [],
  userState: {},
};
const createTokenizer = (inputSpec: TokenizerSpec, defaultUserState = {}) => {
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
        ? option.token(matchedText, state.userState)
        : option.token;

      /*
      FIXME:
      Currently the behaviour is if the token is null, don't advance the parser
      If it's undefined, do advance the parser, but don't log the token
      Otherwise log the token and advance the parser
      We need all three of these cases, but it needs to be more explicit
      */
      if (token === null) continue;

      const end = state.character + matchedText.length;
      const tokens = token
        // ? [...state.tokens, { ...token, start: state.character, end }]
        ? [...state.tokens, token]
        : state.tokens;

      let { stack, userState } = state;

      if (typeof option.pop === 'boolean') stack = stack.slice(0, -1);
      if (typeof option.pop === 'number') stack = stack.slice(0, -option.pop);
      if (option.push) stack = stack.concat(option.push);

      if (typeof option.updateState === 'function') {
        userState = { ...userState, ...option.updateState(userState) };
      }

      yield* tokenizer({
        penalty: state.penalty + option.penalty,
        remainingText: remainingText.substring(matchedText.length),
        character: end,
        stack,
        tokens,
        userState,
      });
    }
  }
  /* eslint-enable */


  return (text, initialUserState = {}) => {
    let results = [];
    const userState = { ...defaultUserState, ...initialUserState };
    for (const result of tokenizer({ ...defaultTokenizerState, userState, remainingText: text })) {
      results.push(result);
    }
    results = flow(
      sortBy('penalty'),
      map('tokens')
    )(results);
    return results;
  };
};

const twoWordUnits = {
  'degrees celsius': 'celsius',
  'degree celsius': 'celsius',
};
const oneWordUnits = {
  meters: 'meter',
  meter: 'meter',
  yard: 'yard',
  yards: 'yard',
  inches: 'inch',
  second: 'second',
};

const unitPrefixes = {
  per: -1,
  square: 2,
  cubic: 3,
};
const unitSuffixes = {
  squared: 2,
  cubed: 3,
};

const when = curry((fn, transform) => value => (fn(value) ? transform(value) : null));

const wordRegexpCreator = flow(
  range(0),
  map(() => '[a-z]+'),
  join('\\s+'),
  str => new RegExp(str, 'i')
);

const wordMatcher = ({ words, type, dictionary, penalty }) => ({
  token: when(has(__, dictionary), token => ({ type, value: dictionary[token] })),
  match: wordRegexpCreator(words),
  penalty,
});

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
    wordMatcher({ words: 2, type: TOKEN_UNIT_NAME, dictionary: twoWordUnits, penalty: -500 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_NAME, dictionary: oneWordUnits, penalty: -400 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_PREFIX, dictionary: unitPrefixes, penalty: -300 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_SUFFIX, dictionary: unitSuffixes, penalty: -300 }),
  ],
  color: [
    { match: /#[0-9a-f]{3,8}/, token: token => ({ type: TOKEN_COLOR, value: token }), penalty: -500 },
  ],
  brackets: [
    {
      match: '(',
      token: (token, state) => ({ type: TOKEN_OPEN_BRAKET, value: state.bracketLevel }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel + 1 }),
    },
    {
      match: ')',
      token: (token, state) => ({ type: TOKEN_CLOSE_BRAKET, value: state.bracketLevel - 1 }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel - 1 }),
    },
  ],
  noop: [
    { match: /[a-z]+/i, token: { type: TOKEN_NOOP }, penalty: 10 },
  ],
  whitespace: [
    { match: /\s+/, penalty: 0 },
  ],
  otherCharacter: [
    // No numbers, whitespace, operators, or brackets
    // the less this catches, the better the perf
    { match: /[^\w\s*^/+\-%()\[\]]/, penalty: 1000 },
  ],
  // vectorElementSeparator: [
  //   { match: ',', token: { type: TOKEN_VECTOR_SEPARATOR }, penalty: 0, pop: true },
  //   { ref: 'vectorMisc' },
  // ],
  // vectorElement: [
  //   { ref: 'vector' },
  //   { ref: 'number', push: ['vectorElementSeparator'] },
  //   { ref: 'vectorMisc' },
  // ],
  // vectorMisc: [
  //   { match: ']', token: { type: TOKEN_VECTOR_END }, penalty: 0, pop: true },
  //   { ref: 'whitespace' },
  // ],
  // vector: [
  //   { match: '[', token: { type: TOKEN_VECTOR_START }, penalty: -500, push: ['vectorElement'] },
  // ],
  vectorBody: [
    { ref: 'vector' },
    { ref: 'number' },
    { ref: 'whitespace' },
    { match: ',', token: { type: TOKEN_VECTOR_SEPARATOR }, penalty: 0 },
    { match: ']', token: { type: TOKEN_VECTOR_END }, penalty: 0, pop: true },
  ],
  vector: [
    { match: '[', token: { type: TOKEN_VECTOR_START }, penalty: -500, push: ['vectorBody'] },
  ],
  default: [
    { ref: 'operator' },
    { ref: 'number' },
    { ref: 'unit' },
    { ref: 'color' },
    { ref: 'brackets' },
    { ref: 'vector' },
    { ref: 'noop' },
    { ref: 'whitespace' },
    { ref: 'otherCharacter' },
  ],
}, {
  bracketLevel: 0,
});
/* eslint-enable */

const input = '[[1, 2], [3, 4]]';
console.time('first run');
console.log(tokenizer(input));
console.timeEnd('first run');
// console.time('second run');
// tokenizer(input);
// console.timeEnd('second run');
// console.time('third run');
// tokenizer(input);
// console.timeEnd('third run');
