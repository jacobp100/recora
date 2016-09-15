// @flow
import type { TokenizerSpecEntries } from '../../modules/tokenizer/types';
import {
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
} from '../../tokenTypes';
import oneWordUnits from '../../data/en/1-word-units';
import twoWordUnits from '../../data/en/2-word-units';
import threeWordUnits from '../../data/en/3-word-units';
import abbreviations from '../../data/en/abbreviations';
import { multipleWordsMatcher, wordRegexpMatcher, customWordMatcher } from '../../tokenizerUtil';

const unitPrefixes = {
  per: -1,
  square: 2,
  cubic: 3,
};
const unitSuffixes = {
  squared: 2,
  cubed: 3,
};

const wordWithPowerMatcherBase = {
  match: /([a-z]+)(\^-?\d+(?:\.\d+)?)/i,
  matchIndex: 1,
  transform: (value, tokens) => ([
    { type: TOKEN_UNIT_NAME, value },
    { type: TOKEN_UNIT_SUFFIX, value: Number(tokens[2].substring(1)) },
  ]),
};

/* eslint-disable max-len */
const unitSpecEntry: TokenizerSpecEntries = [
  multipleWordsMatcher({ words: 3, type: TOKEN_UNIT_NAME, dictionary: threeWordUnits, penalty: -600 }),
  multipleWordsMatcher({ words: 2, type: TOKEN_UNIT_NAME, dictionary: twoWordUnits, penalty: -500 }),
  multipleWordsMatcher({ words: 1, type: TOKEN_UNIT_NAME, dictionary: oneWordUnits, penalty: -400 }),
  multipleWordsMatcher({ words: 1, type: TOKEN_UNIT_PREFIX, dictionary: unitPrefixes, penalty: -300 }),
  multipleWordsMatcher({ words: 1, type: TOKEN_UNIT_SUFFIX, dictionary: unitSuffixes, penalty: -300 }),
  wordRegexpMatcher({
    type: TOKEN_UNIT_NAME,
    dictionary: abbreviations,
    match: /([a-z]+|[£$€]|)/i,
    matchIndex: 1,
    penalty: -200,
  }),
  customWordMatcher({
    ...wordWithPowerMatcherBase,
    dictionary: oneWordUnits,
    penalty: -5000,
  }),
  customWordMatcher({
    ...wordWithPowerMatcherBase,
    dictionary: abbreviations,
    penalty: -3000,
  }),
];
/* eslint-enable */

export default unitSpecEntry;
