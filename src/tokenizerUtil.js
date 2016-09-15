// @flow
import { map, flow, has, join, range } from 'lodash/fp';
import type { TokenizerSpecEntry, TokenResult } from './modules/tokenizer/types';

const wordRegexpCreator: (words: number) => RegExp = flow(
  range(0),
  map(() => '[a-z]+'),
  join('\\s+'),
  str => new RegExp(str, 'i')
);

type CustomWordMatcher = {
  dictionary: Object,
  penalty: number,
  match: RegExp,
  matchIndex: number,
  transform: (matchedWord: string, matches: string[]) => TokenResult,
};

type WordMatcher = {
  type: string,
  dictionary: Object,
  penalty: number,
  words: number,
};

type WordRegexpMatcher = {
  type: string,
  dictionary: Object,
  penalty: number,
  match: RegExp,
  matchIndex: number,
};

export const customWordMatcher = ({
  dictionary,
  penalty,
  match,
  matchIndex,
  transform,
}: CustomWordMatcher): TokenizerSpecEntry => ({
  token: (token, tokens) => {
    const match = tokens[matchIndex].toLowerCase();
    return has(match, dictionary)
      ? transform(dictionary[match], tokens)
      : null;
  },
  match,
  penalty,
});

export const multipleWordsMatcher = ({
  type,
  words,
  dictionary,
  penalty,
}: WordMatcher) => customWordMatcher({
  dictionary,
  penalty,
  match: wordRegexpCreator(words),
  matchIndex: 0,
  transform: value => ({ type, value }),
});

export const wordRegexpMatcher = ({
  type,
  dictionary,
  penalty,
  match,
  matchIndex = 0,
}: WordRegexpMatcher) => customWordMatcher({
  dictionary,
  penalty,
  match,
  matchIndex,
  transform: value => ({ type, value }),
});
