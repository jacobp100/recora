// @flow
import { map, flow, has, join, range } from 'lodash/fp';
import type { TokenizerSpecEntry } from './modules/tokenizer/types';

const wordRegexpCreator = flow(
  range(0),
  map(() => '[a-z]+'),
  join('\\s+'),
  str => new RegExp(str, 'i')
);

type WordMatcher = {
  words: number,
  type: string,
  dictionary: Object,
  penalty: number,
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
  token: (token, tokens) => (
    has(tokens[matchIndex], dictionary)
      ? transform(dictionary[tokens[matchIndex]], token, tokens)
      : null
    ),
  match,
  penalty,
});
