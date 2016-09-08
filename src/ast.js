// @flow
/* eslint-disable no-unused-vars */
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE,
  TOKEN_COLOR,
  TOKEN_NOOP,
  TOKEN_VECTOR_START,
  TOKEN_VECTOR_SEPARATOR,
  TOKEN_VECTOR_END,
  NODE_BRACKETS,
  NODE_OPERATOR_UNARY,
  NODE_OPERATOR_BILINEAR,
  NODE_ENTITY,
  NODE_MISC_GROUP,
} from './types';
/* eslint-enable */
import createTransformer from './modules/createTransformer';
import bracketTransform from './transformers/bracketTransform';
import createOperatorTransform, { FORWARD, BACKWARD } from './transformers/createOperatorTransform';
import entityTransform from './transformers/entityTransform';

const transformTokens = createTransformer([
  bracketTransform,
  createOperatorTransform([TOKEN_OPERATOR_ADD, TOKEN_OPERATOR_SUBTRACT], FORWARD),
  createOperatorTransform([TOKEN_OPERATOR_MULTIPLY, TOKEN_OPERATOR_DIVIDE], FORWARD),
  createOperatorTransform([TOKEN_OPERATOR_EXPONENT, TOKEN_OPERATOR_NEGATE], BACKWARD),
  entityTransform,
]);

console.log(
  JSON.stringify(
    transformTokens([
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_BRACKET_OPEN },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_BRACKET_OPEN },
      // { type: TOKEN_NUMBER, value: 2 },
      // { type: TOKEN_OPERATOR_EXPONENT },
      { type: TOKEN_NUMBER, value: 3 },
      { type: TOKEN_OPERATOR_NEGATE },
      { type: TOKEN_NUMBER, value: 3 },
      { type: TOKEN_NUMBER, value: 3 },
      // { type: TOKEN_OPERATOR_EXPONENT },
      // { type: TOKEN_NUMBER, value: 4 },
      // { type: TOKEN_OPERATOR_MULTIPLY },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_UNIT_NAME, value: 'meter' },
      // { type: TOKEN_BRACKET_CLOSE },
      // { type: TOKEN_UNIT_NAME },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_BRACKET_CLOSE },
      // { type: TOKEN_NUMBER, value: 10 },
    ])
  )
);
