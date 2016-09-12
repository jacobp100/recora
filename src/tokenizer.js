// @flow
import { assignWith, flow, concat, compact } from 'lodash/fp';
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  TOKEN_UNIT_PREFIX,
  TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE,
  TOKEN_COLOR,
  TOKEN_NOOP,
} from './tokenNodeTypes';
import createTokenizer from './modules/createTokenizer';
import type { TokenizerSpec } from './modules/createTokenizer'; // eslint-disable-line

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
  ],
  unit: [
    { match: '/', token: { type: TOKEN_UNIT_PREFIX, value: -1 }, penalty: -1500 },
  ],
  color: [
    { match: /#[0-9a-f]{3,8}/i, token: token => ({ type: TOKEN_COLOR, value: token }), penalty: -1000 },
  ],
  brackets: [
    {
      match: '(',
      token: (token, state) => ({ type: TOKEN_BRACKET_OPEN, value: state.bracketLevel }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel + 1 }),
    },
    {
      match: ')',
      token: (token, state) => ({ type: TOKEN_BRACKET_CLOSE, value: state.bracketLevel - 1 }),
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
    // No numbers, whitespace, operators, or brackets
    // the less this catches, the better the perf
    { match: /[^\w\s*^/+\-%()\[\]]/, penalty: 1000 },
  ],
  default: [
    { ref: 'operator' },
    { ref: 'number' },
    { ref: 'unit' },
    { ref: 'color' },
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
