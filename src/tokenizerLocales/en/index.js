// @flow
import type { TokenizerSpec } from '../../modules/tokenizer/types';
import { TOKEN_NUMBER, TOKEN_PERCENTAGE, TOKEN_FORMATTING_HINT } from '../../tokenTypes';
import unit from './unit';
import date from './date';


/* eslint-disable max-len */
const enLocale: TokenizerSpec = {
  number: [
    {
      // Don't match commas when you write `add(1, 1)`
      match: /\d(?:,\d|\d)*(?:\.\d+)?/i,
      token: token => ({ type: TOKEN_NUMBER, value: Number(token.replace(/,/g, '')) }),
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
/* eslint-enable */

export default enLocale;
