// @flow
import {
  __, startsWith, last, get, map, flatMap, mapValues, flow, assign, sortBy, zip, reduce, drop,
} from 'lodash/fp';
import type { Tokenizer, TokenizerSpec, TokenizerState } from './types';

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
        matches = regexMatch || null;
      }

      if (!matches) continue;

      const matchedText: string = matches[0];
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

      const start = state.character;
      const end = state.character + matchedText.length;
      let tokens;

      if (!token) {
        tokens = state.tokens;
      } else if (Array.isArray(token)) {
        const { tokens: mappedTokens } = reduce((accum, [match, token]) => {
          let index = matchedText.indexOf(match, accum.index);

          if (index === -1) index = accum.index;

          const tokenStart = start + index;
          const tokenEnd = tokenStart + match.length;

          if (token) accum.tokens.push({ ...token, start: tokenStart, end: tokenEnd });
          accum.index = index; // eslint-disable-line

          return accum;
        }, {
          index: 0,
          tokens: [],
        }, zip(drop(1, matches), token));

        tokens = state.tokens.concat(mappedTokens);
      } else {
        tokens = state.tokens.concat({ ...token, start, end });
      }

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
