// @flow
import { map, flow, has, join, range } from 'lodash/fp';
import type { TokenNodeType } from './tokenNodeTypes';
import type { TokenizerSpecEntry } from './modules/createTokenizer';

const wordRegexpCreator = flow(
  range(0),
  map(() => '[a-z]+'),
  join('\\s+'),
  str => new RegExp(str, 'i')
);

type WordMatcher = {
  words: number,
  type: TokenNodeType,
  dictionary: Object,
  penalty: number,
};
export const wordMatcher = ({ // eslint-disable-line
  words,
  type,
  dictionary,
  penalty,
}: WordMatcher): TokenizerSpecEntry => ({
  token: token => (has(token, dictionary) ? ({ type, value: dictionary[token] }) : null),
  match: wordRegexpCreator(words),
  penalty,
});
