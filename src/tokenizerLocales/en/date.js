// @flow
import { flow, drop, map, reduce, assign, join } from 'lodash/fp';
import type { TokenBase, TokenizerSpecEntries } from '../../modules/tokenizer/types';
import type { DateTime } from '../../modules/math/types';
import {
  TOKEN_OPERATOR_ADD,
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE,
  TOKEN_DATE_TIME,
} from '../../tokenTypes';
import { propagateNull } from '../../util';


const numberUnlessEmptyString = value => (value === '' ? null : Number(value));

const time = {
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
  match: '([1-9]|[0-3][0-9])(?:\\s*(?:st|nd|rd|th))?',
  transform: value => ({
    date: Number(value),
  }),
};

const monthPrefixes =
  ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const monthName = {
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
    month: monthPrefixes.indexOf(match.substring(0, 3).toLowerCase()) + 1,
  }),
};

const year = {
  match: '([1-9]\\d{1,3})',
  transform: year => ({
    year: Number(year),
  }),
};


const defaultValue: DateTime = {
  year: null,
  month: null,
  date: null,
  hour: null,
  minute: null,
  second: null,
  timezone: null,
};

const createRegExp = flow(
  map('match'),
  map(match => `\\b${match}\\b`),
  join('\\s*'),
  string => new RegExp(string, 'i'),
);

const createTransformer = transformers => (match, matches): ?TokenBase => {
  const valueMatches = reduce(propagateNull((accum, transformer) => {
    const arity = transformer.matchCount || 1;
    const args = accum.remainingMatches.slice(0, arity);
    const remainingMatches = accum.remainingMatches.slice(arity);

    const newValue = transformer.transform(...args, accum.value);
    if (!newValue) return null;
    const value = assign(accum.value, newValue);

    return { value, remainingMatches };
  }), {
    value: defaultValue,
    remainingMatches: drop(1, matches),
  }, transformers);

  if (!valueMatches) return null;
  const { value } = valueMatches;

  return { type: TOKEN_DATE_TIME, value: { value, directionHint: 1 } };
};

const createDateMatcher = (transformers, penalty) => ({
  match: createRegExp(transformers),
  token: createTransformer(transformers),
  penalty,
});

const createRelativeDate = (count, unit) => [
  { type: TOKEN_BRACKET_OPEN },
  { type: TOKEN_DATE_TIME, value: { value: defaultValue, directionHint: 1 } },
  { type: TOKEN_OPERATOR_ADD },
  { type: TOKEN_NUMBER, value: count },
  { type: TOKEN_UNIT_NAME, value: unit },
  { type: TOKEN_BRACKET_CLOSE },
];


/* eslint-disable max-len */
const dateSpec: TokenizerSpecEntries = [
  createDateMatcher([date, monthName, year], -50000),
  createDateMatcher([monthName, date, year], -50000),
  createDateMatcher([date, monthName], -30000),
  createDateMatcher([monthName, date], -30000),
  createDateMatcher([time, date, monthName, year], -70000),
  createDateMatcher([time, monthName, date, year], -70000),
  createDateMatcher([time, date, monthName], -50000),
  createDateMatcher([time, monthName, date], -50000),
  createDateMatcher([time, date], -30000),
  createDateMatcher([date, time], -30000),
  createDateMatcher([time], -20000),
  {
    match: /\bnow|today\b/i,
    token: { type: TOKEN_DATE_TIME, value: { value: defaultValue, directionHint: 1 } },
    penalty: -500,
  },
  {
    match: /\byesterday\b/i,
    token: () => createRelativeDate(-1, 'day'),
    tokenIndices: [2],
    penalty: -500,
  },
  {
    match: /\btomorrow\b/i,
    token: () => createRelativeDate(1, 'day'),
    tokenIndices: [2],
    penalty: -500,
  },
  {
    match: /\bago\b/i,
    token: { type: TOKEN_DATE_TIME, value: { value: defaultValue, directionHint: -1 } },
    penalty: -500,
  },
  {
    match: /\b(next|last)\s+(week|month|year|century|millenium)\b/i,
    token: (match, matches) => createRelativeDate(
      matches[1].toLowerCase() === 'next' ? 1 : -1,
      matches[2].toLowerCase()
    ),
    tokenIndices: [2, 5],
    penalty: -500,
  },
];
/* eslint-enable */

export default dateSpec;
