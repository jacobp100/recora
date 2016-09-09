// @flow
import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, every, curry,
} from 'lodash/fp';
import unitDefinitions from '../data/units';
import type { ConversionDescriptor, UnitName, Units } from '../data/units'; // eslint-disable-line
import type { Curry2 } from '../../utilTypes';

export type Entity = { quantity: number, units: Units };

type CombineUnits = Curry2<Units, Units, Units>;
export const combineUnits: CombineUnits = curry((units1, units2) => flow(
  mergeWith((lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0))),
  omitBy(eq(0))
)(units1, units2));

const getConversionDescriptor = (unitName: UnitName): ConversionDescriptor => {
  const siUnitDescriptor = unitDefinitions[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};

export const siUnits = (units: Units): Units => reduce((accum, [unitName, unitValue]) => {
  const siUnitDimensions = getConversionDescriptor(unitName)[1];
  const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
  return combineUnits(scaledSiUnitDimensions, accum);
}, {}, toPairs(units));

export const isCompatable = (units1: Units, units2: Units): boolean =>
  isEqual(siUnits(units1), siUnits(units2));

export const unitIsLinear = (unitName: UnitName): boolean =>
  typeof getConversionDescriptor(unitName)[0] === 'number';

export const isLinear = (units: Units): boolean =>
  flow(keys, every(unitIsLinear))(units);


type ConversionDirection = number;
const conversionValueNumerator = 1;
const conversionValueDenominator = -1;

const calculateConversionValue = (
  direction: ConversionDirection,
  quantity: number,
  units: Units
) => reduce((quantity, unitName) => {
  const siUnitValue = getConversionDescriptor(unitName)[0];

  if (typeof siUnitValue === 'number') {
    return quantity * Math.pow(siUnitValue, units[unitName] * direction);
  } else if (direction === conversionValueNumerator) {
    return siUnitValue.convertFromBase(quantity);
  }
  return siUnitValue.convertToBase(quantity);
}, quantity, keys(units));

export const convertTo = (units: Units, entity: Entity): ?Entity => {
  if (isEqual(units, entity.units)) return entity;
  if (!isCompatable(units, entity.units)) return null;
  let quantity = calculateConversionValue(conversionValueNumerator, entity.quantity, entity.units);
  quantity = calculateConversionValue(conversionValueDenominator, quantity, units);
  return { quantity, units };
};
