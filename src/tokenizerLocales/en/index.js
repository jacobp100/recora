// @flow
import type { TokenizerSpec } from '../../modules/tokenizer/types';
import { TOKEN_NUMBER } from '../../tokenTypes';
import unit from './unit';
import date from './date';


/* eslint-disable max-len */
const enLocale: TokenizerSpec = {
  number: [
    {
      match: /\d[\d,]*(?:\.\d+)?/,
      token: token => ({ type: TOKEN_NUMBER, value: Number(token.replace(/,/g, '')) }),
      penalty: -1000,
    },
  ],
  unit,
  date,
};
/* eslint-enable */

export default enLocale;
