// @flow
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
} from './types';
import createTransformer from './modules/createTransformer';
import bracketTransform from './transformers/bracketTransform';
import createOperatorTransform, { FORWARD, BACKWARD } from './transformers/createOperatorTransform';
import entityTransform from './transformers/entityTransform';

export default createTransformer([
  bracketTransform,
  createOperatorTransform([TOKEN_OPERATOR_ADD, TOKEN_OPERATOR_SUBTRACT], FORWARD),
  createOperatorTransform([TOKEN_OPERATOR_MULTIPLY, TOKEN_OPERATOR_DIVIDE], FORWARD),
  createOperatorTransform([TOKEN_OPERATOR_EXPONENT, TOKEN_OPERATOR_NEGATE], BACKWARD),
  entityTransform,
]);
