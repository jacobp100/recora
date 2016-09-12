// @flow
import {
  __, startsWith, last, get, map, flatMap, mapValues, flow, assign, sortBy,
} from 'lodash/fp';
import type { TokenBase } from '../tokenNodeTypes'; // eslint-disable-line

export type TokenTransform = (token: string, state: Object) => ?TokenBase;
export type TokenizerSpecEntry = {
  match: RegExp | string,
  penalty: number,
  token?: TokenTransform | ?TokenBase,
  push?: string[],
  pop?: boolean | number,
  updateState?: (state: Object) => Object
};
export type TokenizerSpecEntryRef = {
  ref: string,
  match?: RegExp | string,
  penalty?: number,
  token?: TokenTransform | ?TokenBase,
  push?: string[],
  pop?: boolean | number,
  updateState?: (state: Object) => Object
}

export type TokenizerSpec = ({ [key:string]: (TokenizerSpecEntry | TokenizerSpecEntryRef)[] });
export type TokenizerState = {
  character: number,
  stack: string[],
  penalty: number,
  remainingText: string,
  tokens: TokenBase[],
  userState: Object,
};

export type Tokenizer = (text: string, initialUserState: ?Object) => (TokenBase[])[];

const defaultTokenizerState = {
  character: 0,
  stack: ['default'],
  penalty: 0,
  remainingText: '',
  tokens: [],
  userState: {},
};
export default (inputSpec: TokenizerSpec, defaultUserState: Object = {}): Tokenizer => {
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
      let matches: ?(string[]) = null;

      if (typeof matchSpec === 'string') {
        matches = startsWith(matchSpec, remainingText) ? [matchSpec] : null;
      } else if (matchSpec instanceof RegExp) {
        const regexMatch = remainingText.search(matchSpec) === 0 && remainingText.match(matchSpec);
        matches = regexMatch;
      }

      if (!matches) continue;

      const matchedText: ?string = matches && matches[0];
      const token = typeof option.token === 'function'
        ? option.token(matchedText, matches, state.userState)
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
        ? [...state.tokens, { ...token, start: state.character, end }]
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
