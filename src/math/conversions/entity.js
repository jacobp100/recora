// @flow
import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, values, every,
} from 'lodash/fp';
import unitDefinitions from '../data/units';

type UnitName = string;
type UnitValue = number;
type Units = { [key: UnitName]: UnitValue };
type Entity = { value: number, units: Units };

export const combineUnits = flow(
  mergeWith((lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0))),
  omitBy(eq(0))
);

type ConvertSiDirection = number;
const calculateSiValueNumerator = 1;
const calculateSiValueDenominator = -1;

const getSiUnitDescriptor = unitName => {
  const siUnitDescriptor = unitDefinitions[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};

const siUnits = (units: Units) => reduce((accum, [unitName, unitValue]) => {
  const siUnitDimensions = getSiUnitDescriptor(unitName)[1];
  const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
  return combineUnits(scaledSiUnitDimensions, accum);
}, {}, toPairs(units));

export const isCompatable = (units1, units2) => isEqual(siUnits(units1), siUnits(units2));
export const unitIsLinear = unitName => typeof getSiUnitDescriptor(unitName)[0] === 'number';
export const isLinear = units => flow(values, every(isLinear))(units);

const calculateSiValue = (
  direction: ConvertSiDirection,
  value: number,
  units: Units
) => reduce((value, unitName) => {
  const siUnitValue = getSiUnitDescriptor(unitName)[0];

  if (typeof siUnitValue === 'number') {
    return value * Math.pow(siUnitValue, units[unitName] * direction);
  } else if (direction === calculateSiValueNumerator) {
    return siUnitValue.convertFromBase(value);
  }
  return siUnitValue.convertToBase(value);
}, value, keys(units));

export const convertTo = (units: Units, entity: Entity): ?Entity => {
  if (isEqual(units, entity.units)) return entity;
  if (!isCompatable(units, entity.units)) return null;
  let value = calculateSiValue(calculateSiValueNumerator, entity.value, entity.units);
  value = calculateSiValue(calculateSiValueDenominator, value, units);
  return { value, units };
};

export default convertTo;
