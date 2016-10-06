// @flow
import { keys } from 'lodash/fp';
import constants from '../../modules/math/constants';
import type { TokenizerSpec } from '../../modules/tokenizer/types';
import {
  TOKEN_NUMBER, TOKEN_CONSTANT, TOKEN_PERCENTAGE, TOKEN_FORMATTING_HINT,
} from '../../tokenTypes';
import unit from './unit';
import date from './date';


const numberReString = '\\d(?:,\\d|\\d)*(?:\\.\\d+)?';
const toNumber = value => Number(value.replace(/,/g, '') || 0);

/* eslint-disable max-len */
const enLocale: TokenizerSpec = {
  number: [
    {
      // Don't match commas when you write `add(1, 1)`
      match: new RegExp(numberReString),
      token: token => ({ type: TOKEN_NUMBER, value: toNumber(token) }),
      penalty: -1000,
    },
  ],
  constant: [
    {
      match: new RegExp(`(${keys(constants).join('|')})(\\^${numberReString}|)\\b`, 'i'),
      token: (token, tokens) => ({
        type: TOKEN_CONSTANT,
        value: {
          value: constants[tokens[1]],
          power: tokens[2] ? toNumber(tokens[2].substring(1)) : 1,
        },
      }),
      penalty: -5000,
    },
  ],
  percent: [
    { match: /\bper\s*cent/i, token: { type: TOKEN_PERCENTAGE }, penalty: -1000 },
  ],
  formattingHint: [
    {
      match: /\bbase\s+(\d+)\b/i,
      token: (token, tokens) => ({
        type: TOKEN_FORMATTING_HINT,
        value: {
          key: 'base',
          value: Number(tokens[1]),
        },
      }),
      penalty: -2000,
    },
    {
      match: /\boct(?:al)?\b/i,
      token: { type: TOKEN_FORMATTING_HINT, value: { key: 'base', value: 8 } },
      penalty: -2000,
    },
    {
      match: /\bbin(?:ary)?\b/i,
      token: { type: TOKEN_FORMATTING_HINT, value: { key: 'base', value: 2 } },
      penalty: -2000,
    },
    {
      match: /\bhex(?:adecimal)?\b/i,
      token: { type: TOKEN_FORMATTING_HINT, value: { key: 'base', value: 16 } },
      penalty: -2000,
    },
  ],
  unit,
  date,
};
/* eslint-enable */

export default enLocale;
