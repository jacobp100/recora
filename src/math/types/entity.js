import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, values, every,
} from 'lodash/fp';
import unitDefinitions from '../data/units';
import type { UnitDescriptor } from '../data/units'; // eslint-disable-line

type UnitName = string;
type UnitValue = number;
type Units = { [key: UnitName]: UnitValue };
export type Entity = { value: number, units: Units };

export const combineUnits: (units1: Units, units2: Units) => Units = flow(
  mergeWith((lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0))),
  omitBy(eq(0))
);

const getSiUnitDescriptor = (unitName: UnitName): UnitDescriptor => {
  const siUnitDescriptor = unitDefinitions[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};

export const siUnits = (units: Units): Units => reduce((accum, [unitName, unitValue]) => {
  const siUnitDimensions = getSiUnitDescriptor(unitName)[1];
  const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
  return combineUnits(scaledSiUnitDimensions, accum);
}, {}, toPairs(units));

export const isCompatable = (units1: Units, units2: Units): boolean =>
  isEqual(siUnits(units1), siUnits(units2));

export const unitIsLinear = (unitName: UnitName): boolean =>
  typeof getSiUnitDescriptor(unitName)[0] === 'number';

export const isLinear = (units: Units): boolean =>
  flow(values, every(isLinear))(units);


type ConvertSiDirection = number;
const calculateSiValueNumerator = 1;
const calculateSiValueDenominator = -1;

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
