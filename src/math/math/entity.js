// @flow
import { matchesProperty, mapValues, update, multiply, isEmpty } from 'lodash/fp';
import { convertTo, combineUnits, isLinear } from '../conversions/entity';

const isZero = matchesProperty('value', 0);
const zeroEntity = { value: 0, units: {} };
const hasUnits = entity => !isEmpty(entity.units);

const addSubtractFactory = direction => (left, right) => {
  if (!isLinear(left) || !isLinear(right)) return null;
  if (isZero(right)) return left;
  if (isZero(left)) return update('value', multiply(direction), right);

  const rightWithLhsUnits = convertTo(left.units, right);
  if (!rightWithLhsUnits) return null;

  const value = left.value + (rightWithLhsUnits.value * direction);
  const units = left.units;

  return { value, units };
};

const multiplyDivideFactory = direction => (left, right) => {
  if (isZero(left)) return zeroEntity;
  if (isZero(right)) return direction === 1 ? zeroEntity : null; // No division by zero

  const rightEffectiveUnits = direction === 1
    ? right.units
    : mapValues(multiply(-1), right.units);

  const value = left.value * Math.pow(right.value, direction);
  const units = combineUnits(left.units, rightEffectiveUnits);
  return { units, value };
};

const exponentMath = (left, right) => {
  // FIXME: Some units are allowed (degrees)
  if (hasUnits(right)) return null;

  const value = Math.pow(left.value, right.value);
  const units = mapValues(multiply(right.value), left.units);

  return { value, units };
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
