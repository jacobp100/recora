// @flow
import { assignWith, flow, concat, compact } from 'lodash/fp';
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  TOKEN_OPERATOR_FACTORIAL,
  TOKEN_UNIT_PREFIX,
  TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE,
  TOKEN_COLOR,
  TOKEN_NOOP,
} from './tokenTypes';
import createTokenizer from './modules/tokenizer';
import type { TokenizerSpec } from './modules/tokenizer/types';

const concatCompact = flow(concat, compact);

/* eslint-disable max-len */
export default (locale: TokenizerSpec) => createTokenizer(assignWith(concatCompact, locale, {
  operator: [
    { match: '**', token: { type: TOKEN_OPERATOR_EXPONENT }, penalty: -1000 },
    { match: '^', token: { type: TOKEN_OPERATOR_EXPONENT }, penalty: -1000 },
    { match: /\*(?!\*)/, token: { type: TOKEN_OPERATOR_MULTIPLY }, penalty: -1000 },
    { match: '/', token: { type: TOKEN_OPERATOR_DIVIDE }, penalty: -1000 },
    { match: '+', token: { type: TOKEN_OPERATOR_ADD }, penalty: -1000 },
    { match: '-', token: { type: TOKEN_OPERATOR_SUBTRACT }, penalty: -1000 },
    { match: '-', token: { type: TOKEN_OPERATOR_NEGATE }, penalty: -500 },
    { match: '!', token: { type: TOKEN_OPERATOR_FACTORIAL }, penalty: -500 },
  ],
  unit: [
    { match: '/', token: { type: TOKEN_UNIT_PREFIX, value: -1 }, penalty: -1500 },
  ],
  color: [
    { match: /#[0-9a-f]{3,8}/i, token: token => ({ type: TOKEN_COLOR, value: token }), penalty: -1000 },
  ],
  date: [
    {
      // ISO 8601 RegExp
      // http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
      match: /([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?/,
      token: () => null,
      penalty: -50000, // Has to beat multiple numbers
    },
  ],
  brackets: [
    {
      match: '(',
      token: (token, matches, state) => ({ type: TOKEN_BRACKET_OPEN, value: state.bracketLevel }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel + 1 }),
    },
    {
      match: ')',
      token: (token, matches, state) => ({ type: TOKEN_BRACKET_CLOSE, value: state.bracketLevel - 1 }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel - 1 }),
    },
  ],
  noop: [
    { match: /[a-z]+/i, token: { type: TOKEN_NOOP }, penalty: 10 },
  ],
  whitespace: [
    { match: /\s+/, penalty: 0 },
  ],
  otherCharacter: [
    // No numbers, whitespace, operators (except - and !), or brackets
    // the less this catches, the better the perf
    { match: /[^\w\s*^/+%()\[\]]/, penalty: 1000 },
  ],
  default: [
    { ref: 'operator' },
    { ref: 'number' },
    { ref: 'unit' },
    { ref: 'color' },
    { ref: 'date' },
    { ref: 'brackets' },
    { ref: 'vector' },
    { ref: 'noop' },
    { ref: 'whitespace' },
    { ref: 'otherCharacter' },
  ],
}), {
  bracketLevel: 0,
});
/* eslint-enable */
