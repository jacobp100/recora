// @flow
import { map, flow, has, join, range } from 'lodash/fp';
import type { TokenizerSpecEntry, TokenResult } from './modules/tokenizer/types';

const wordRegexpCreator: (words: number) => RegExp = flow(
  range(0),
  map(() => '[a-z]+'),
  join('\\s+'),
  str => new RegExp(str, 'i')
);

type WordMatcher = {
  type: string,
  dictionary: Object,
  penalty: number,
  words?: number,
  match?: RegExp,
  matchIndex?: number,
  transform?: (matchedWord: string, match: string, matches: string[]) => TokenResult,
};
export const wordMatcher = ({ // eslint-disable-line
  type,
  dictionary,
  penalty,
  words = 1,
  match = wordRegexpCreator(words),
  matchIndex = 0,
  transform = (value) => ({ type, value }),
}: WordMatcher): TokenizerSpecEntry => ({
  // FIXME: Refactor
  token: (token, tokens) => (
    has(tokens[matchIndex].toLowerCase(), dictionary)
      ? transform(dictionary[tokens[matchIndex].toLowerCase()], token, tokens)
      : null
    ),
  match,
  penalty,
});
