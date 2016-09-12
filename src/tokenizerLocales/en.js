// @flow
import { flow, drop, map, reduce, set, join } from 'lodash/fp';
import type { TokenizerSpec } from '../modules/createTokenizer';
import {
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  NODE_DATETIME,
} from '../tokenNodeTypes';
import type { DateTimeNode } from '../tokenNodeTypes'; // eslint-disable-line
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

const time = [
  {
    key: 'hour',
    match: '([0-2]\\d)(\\s+am|\\s+pm)?',
    transform: Number, // FIXME: AM/PM
    matchCount: 2,
  },
  {
    key: 'minute',
    match: ':([0-5]\\d)',
    transform: match => Number(match.substring(1)),
  },
  {
    key: 'second',
    match: ':([0-5]\\d)',
    transform: match => Number(match.substring(1)),
  },
];

const date = {
  key: 'date',
  match: '([1-9]|[0-3][0-9])(?:\\s*(?:st|nd|rd|th))?',
  value: Number,
};

const monthPrefixes =
  ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const monthName = {
  key: 'month',
  match: `(?:${[
    '(jan)(?:uary)?',
    '(feb)(?:ruary)?',
    '(mar)(?:ch)?',
    '(apr)(?:il)?',
    '(may)',
    '(jun)e?',
    '(jul)y?',
    '(aug)(?:ust)?',
    '(sep)(?:t(?:ember)?)?',
    '(oct)(?:ober)?',
    '(nov)(?:ember)?',
    '(dec)(?:ember)?',
  ].join('|')})`,
  transform: match => monthPrefixes.indexOf(match.toLowerCase()),
};

const year = {
  key: 'year',
  match: '\\d{2}(?:\\d{2})?',
  transform: Number,
};


const createRegExp = flow(
  map('match'),
  join('\\s*'),
  string => new RegExp(string, 'i'),
);

const defaultValue = {
  year: null,
  month: null,
  date: null,
  hour: null,
  minute: null,
  second: null,
  tz: null,
};

const createTransformer = transformers => (match, matches): DateTimeNode => {
  const value = reduce((accum, transformer) => {
    const arity = transformer.matchCount || 1;
    const args = accum.remainingMatches.slice(0, arity);
    const remainingMatches = accum.remainingMatches.slice(arity);
    const value = set(transformer.key, transformer.transform(args), accum.value);
    return { value, remainingMatches };
  }, {
    value: defaultValue,
    remainingMatches: drop(1, matches),
  }, transformers);

  return { NODE_DATETIME, value };
};

const createDateMatcher = (transformers, penalty) => ({
  match: createRegExp(transformers),
  transform: createTransformer(transformers),
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
    createDateMatcher([date, monthName, year]),
    createDateMatcher([monthName, date, year]),
    createDateMatcher([date, monthName]),
    createDateMatcher([monthName, date]),
    createDateMatcher([...time, date, monthName, year]),
    createDateMatcher([...time, monthName, date, year]),
    createDateMatcher([...time, date, monthName]),
    createDateMatcher([...time, monthName, date]),
    createDateMatcher([...time]),
  ],
};
/* eslint-enable */

export default enLocale;
