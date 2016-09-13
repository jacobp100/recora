// @flow
import { flow, drop, map, reduce, assign, join } from 'lodash/fp';
import type { TokenBase, TokenizerSpec } from '../modules/tokenizer/types';
import {
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  TOKEN_DATETIME,
} from '../tokenTypes';
import oneWordUnits from '../data/en/1-word-units';
import twoWordUnits from '../data/en/2-word-units';
import threeWordUnits from '../data/en/3-word-units';
import abbreviations from '../data/en/abbreviations';
import { wordMatcher } from '../tokenizerUtil';

const unitPrefixes = {
  per: -1,
  square: 2,
  cubic: 3,
};
const unitSuffixes = {
  squared: 2,
  cubed: 3,
};

const numberUnlessEmptyString = value => (value === '' ? null : Number(value));

const time = {
  key: 'hour',
  match: '([0-2]?\\d)(:[0-5]\\d|)(:[0-5]\\d|)(\\s*am|\\s*pm|)',
  matchCount: 4,
  transform: (hour, minute, second, amPm) => (
    (minute === '' && amPm === '')
      ? null
      : {
        hour: Number(hour) + (amPm.toLowerCase() === 'pm' ? 12 : 0),
        minute: numberUnlessEmptyString(minute.substring(1)),
        second: numberUnlessEmptyString(second.substring(1)),
      }
  ),
};

const date = {
  key: 'date',
  match: '([1-9]|[0-3][0-9])(?:\\s*(?:st|nd|rd|th))?',
  transform: value => ({
    date: Number(value),
  }),
};

const monthPrefixes =
  ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const monthName = {
  key: 'month',
  match: `(${[
    'jan(?:uary)?',
    'feb(?:ruary)?',
    'mar(?:ch)?',
    'apr(?:il)?',
    'may',
    'june?',
    'july?',
    'aug(?:ust)?',
    'sep(?:t(?:ember)?)?',
    'oct(?:ober)?',
    'nov(?:ember)?',
    'dec(?:ember)?',
  ].join('|')})`,
  transform: match => ({
    month: monthPrefixes.indexOf(match.substring(0, 3).toLowerCase()),
  }),
};

const year = {
  key: 'year',
  match: '([1-9]\\d{1,3})',
  transform: year => ({
    year: Number(year),
  }),
};


const defaultValue = {
  year: null,
  month: null,
  date: null,
  hour: null,
  minute: null,
  second: null,
  tz: null,
};

const createRegExp = flow(
  map('match'),
  map(match => `\\b${match}\\b`),
  join('\\s*'),
  string => new RegExp(string, 'i'),
);

const createTransformer = transformers => (match, matches): TokenBase => {
  const { value } = reduce((accum, transformer) => {
    const arity = transformer.matchCount || 1;
    const args = accum.remainingMatches.slice(0, arity);
    const remainingMatches = accum.remainingMatches.slice(arity);

    const newValue = transformer.transform(...args, accum.value);
    const value = assign(accum.value, newValue);

    return { value, remainingMatches };
  }, {
    value: defaultValue,
    remainingMatches: drop(1, matches),
  }, transformers);

  return { type: TOKEN_DATETIME, value };
};

const createDateMatcher = (transformers, penalty) => ({
  match: createRegExp(transformers),
  token: createTransformer(transformers),
  penalty,
});

/* eslint-disable max-len */
const enLocale: TokenizerSpec = {
  number: [
    {
      match: /\d[\d,]*(?:\.\d+)?/,
      token: token => ({ type: TOKEN_NUMBER, value: Number(token.replace(/,/g, '')) }),
      penalty: -1000,
    },
  ],
  unit: [
    wordMatcher({ words: 3, type: TOKEN_UNIT_NAME, dictionary: threeWordUnits, penalty: -600 }),
    wordMatcher({ words: 2, type: TOKEN_UNIT_NAME, dictionary: twoWordUnits, penalty: -500 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_NAME, dictionary: oneWordUnits, penalty: -400 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_NAME, dictionary: abbreviations, penalty: -200 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_PREFIX, dictionary: unitPrefixes, penalty: -300 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_SUFFIX, dictionary: unitSuffixes, penalty: -300 }),
  ],
  date: [
    createDateMatcher([date, monthName, year], -50000),
    createDateMatcher([monthName, date, year], -50000),
    createDateMatcher([date, monthName], -30000),
    createDateMatcher([monthName, date], -30000),
    createDateMatcher([time, date, monthName, year], -70000),
    createDateMatcher([time, monthName, date, year], -70000),
    createDateMatcher([time, date, monthName], -50000),
    createDateMatcher([time, monthName, date], -50000),
    // TODO: Allow stuff like 6
  ],
};
/* eslint-enable */

export default enLocale;
