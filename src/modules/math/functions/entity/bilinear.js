// @flow
import { matchesProperty, mapValues, update, multiply } from 'lodash/fp';
import {
  convertTo, combineUnits, convertToFundamentalUnits, unitsAreLinear, isUnitless, simplifyUnits,
} from '../../types/entity';
import { NODE_ENTITY, baseEntity } from '../../types';
import type { ResolverContext, EntityNode } from '../../types'; // eslint-disable-line
import {
  FUNCTION_ADD, FUNCTION_SUBTRACT, FUNCTION_MULTIPLY, FUNCTION_DIVIDE, FUNCTION_EXPONENT,
} from '..';

const isZero = matchesProperty('quantity', 0);
const zeroEntity = { ...baseEntity, quantity: 0 };


const addSubtractFactory = direction => (
  context: ResolverContext,
  left: EntityNode,
  right: EntityNode
): ?EntityNode => {
  if (!unitsAreLinear(context, left.units) || !unitsAreLinear(context, right.units)) return null;
  if (isZero(right)) return left;
  if (isZero(left)) return update('quantity', multiply(direction), right);

  const rightWithLhsUnits = convertTo(context, left.units, right);
  if (!rightWithLhsUnits) return null;

  const quantity = left.quantity + (rightWithLhsUnits.quantity * direction);
  const units = left.units;
  return { ...baseEntity, quantity, units };
};

const multiplyDivideFactory = direction => (
  context: ResolverContext,
  left: EntityNode,
  right: EntityNode
): ?EntityNode => {
  if (isZero(left)) return zeroEntity;
  if (isZero(right)) return direction === 1 ? zeroEntity : null; // No division by zero

  const rightEffectiveUnits = direction === 1
    ? right.units
    : mapValues(multiply(-1), right.units);

  const quantity = left.quantity * Math.pow(right.quantity, direction);
  const units = combineUnits(left.units, rightEffectiveUnits);

  let entity = { ...baseEntity, quantity, units };
  entity = simplifyUnits(context, entity);

  return entity;
};

const exponentMath = (
  context: ResolverContext,
  left: EntityNode,
  right: EntityNode
): ?EntityNode => {
  let rightFundamentalUnits = right;

  if (!isUnitless(right)) {
    // Note: done for minor perf
    rightFundamentalUnits = convertToFundamentalUnits(context, right);
  }

  if (!rightFundamentalUnits || !isUnitless(rightFundamentalUnits)) return null;

  const quantity = Math.pow(left.quantity, rightFundamentalUnits.quantity);
  const units = mapValues(multiply(right.quantity), left.units);
  return { ...baseEntity, quantity, units };
};

const addMath = addSubtractFactory(1);
const subtractMath = addSubtractFactory(-1);
const multiplyMath = multiplyDivideFactory(1);
const divideMath = multiplyDivideFactory(-1);

export {
  addMath as add,
  subtractMath as subtract,
  multiplyMath as multiply,
  divideMath as divide,
  exponentMath as exponent,
};

export default [
  [FUNCTION_ADD, [NODE_ENTITY, NODE_ENTITY], addMath],
  [FUNCTION_SUBTRACT, [NODE_ENTITY, NODE_ENTITY], subtractMath],
  [FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_ENTITY], multiplyMath],
  [FUNCTION_DIVIDE, [NODE_ENTITY, NODE_ENTITY], divideMath],
  [FUNCTION_EXPONENT, [NODE_ENTITY, NODE_ENTITY], exponentMath],
];
