// @flow
import type { TokenizerSpec } from '../../modules/tokenizer/types';
import { TOKEN_NUMBER, TOKEN_PERCENTAGE } from '../../tokenTypes';
import unit from './unit';
import date from './date';


/* eslint-disable max-len */
const enLocale: TokenizerSpec = {
  number: [
    {
      // Don't match commas when you write `add(1, 1)`
      match: /\d(?:,\d|\d)*(?:\.\d+)?/,
      token: token => ({ type: TOKEN_NUMBER, value: Number(token.replace(/,/g, '')) }),
      penalty: -1000,
    },
  ],
  percent: [
    { match: /per\s*cent/, token: { type: TOKEN_PERCENTAGE }, penalty: -1000 },
  ],
  unit,
  date,
};
/* eslint-enable */

export default enLocale;
