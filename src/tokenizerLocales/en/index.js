// @flow
import { keys, concat } from 'lodash/fp';
import constants from '../../modules/math/constants';
import type { TokenizerSpec } from '../../modules/tokenizer/types';
import {
  TOKEN_NUMBER, TOKEN_CONSTANT, TOKEN_PERCENTAGE, TOKEN_FORMATTING_HINT,
} from '../../tokenTypes';
import unit from './unit';
import date from './date';
import { mergeTokenizerSpecs } from '../../tokenizerUtil';


const numberReString = '\\d(?:,\\d|\\d)*(?:\\.\\d+)?';
const toNumber = value => Number(value.replace(/,/g, '') || 0);

const baseEnLocale: TokenizerSpec = {
  number: [
    {
      // Don't match commas when you write `add(1, 1)`
      match: new RegExp(numberReString),
      token: token => ({ type: TOKEN_NUMBER, value: toNumber(token) }),
      penalty: -1000,
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

/* eslint-disable max-len */
const createEnLocale = ({
  userConstants,
}: {
  userConstants: Object
}): TokenizerSpec => mergeTokenizerSpecs(baseEnLocale, {
  constant: [
    {
      match: new RegExp(
        `(${concat(keys(constants), keys(userConstants)).join('|')})(\\^${numberReString}|)\\b`,
        'i'
      ),
      token: (token, [, name, power]) => ({
        type: TOKEN_CONSTANT,
        value: {
          value: (name in userConstants ? userConstants[name] : constants[name]),
          power: (power ? toNumber(power.substring(1)) : 1),
        },
      }),
      penalty: -5000,
    },
  ],
});
/* eslint-enable */

export default createEnLocale;
