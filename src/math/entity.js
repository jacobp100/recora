// @flow
import { matchesProperty, mapValues, update, multiply, isEmpty } from 'lodash/fp';
import { convertTo, combineUnits, siUnits, isLinear } from '../types/entity';
import type { Entity } from '../types/entity'; // eslint-disable-line
import type { ResolverContext } from '../resolverContext';

const isZero = matchesProperty('quantity', 0);
const zeroEntity = { quantity: 0, units: {} };
const hasUnits = entity => !isEmpty(entity.units);

const addSubtractFactory = direction => (
  context: ResolverContext,
  left: Entity,
  right: Entity
) => {
  if (!isLinear(context, left.units) || !isLinear(context, right.units)) return null;
  if (isZero(right)) return left;
  if (isZero(left)) return update('quantity', multiply(direction), right);

  const rightWithLhsUnits = convertTo(context, left.units, right);
  if (!rightWithLhsUnits) return null;

  const quantity = left.quantity + (rightWithLhsUnits.quantity * direction);
  const units = left.units;
  return { quantity, units };
};

const multiplyDivideFactory = direction => (
  context: ResolverContext,
  left: Entity,
  right: Entity
) => {
  if (isZero(left)) return zeroEntity;
  if (isZero(right)) return direction === 1 ? zeroEntity : null; // No division by zero

  const rightEffectiveUnits = direction === 1
    ? right.units
    : mapValues(multiply(-1), right.units);

  // FIXME: reduce units:
  // if you have lhs = x meter^-1 and rhs = y yard, don't give xy meter^1 yard

  const quantity = left.quantity * Math.pow(right.quantity, direction);
  const units = combineUnits(left.units, rightEffectiveUnits);
  return { units, quantity };
};

const exponentMath = (context: ResolverContext, left: Entity, right: Entity) => {
  // Note: done for minor perf
  if (hasUnits(right) && hasUnits(siUnits(context, right))) return null;

  const quantity = Math.pow(left.quantity, right.quantity);
  const units = mapValues(multiply(right.quantity), left.units);
  return { quantity, units };
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
