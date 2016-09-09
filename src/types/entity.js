// @flow
import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, every, curry,
} from 'lodash/fp';
import type { ConversionDescriptor, UnitName, Units } from '../data/units'; // eslint-disable-line
import type { Curry2, Curry3 } from '../utilTypes';
import type { ResolveContext } from '../resolverTypes';

export type Entity = { quantity: number, units: Units };

type CombineUnits = Curry2<Units, Units, Units>;
export const combineUnits: CombineUnits = curry((units1, units2) => flow(
  mergeWith((lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0))),
  omitBy(eq(0))
)(units1, units2));

const getConversionDescriptor = (
  context: ResolveContext,
  unitName: UnitName,
): ConversionDescriptor => {
  const siUnitDescriptor = context.conversionDescriptors[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};

// FIXME: Is this the correct name?
export const siUnits = (
  context: ResolveContext,
  units: Units
): Units => reduce((accum, [unitName, unitValue]) => {
  const siUnitDimensions = getConversionDescriptor(context, unitName)[1];
  const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
  return combineUnits(scaledSiUnitDimensions, accum);
}, {}, toPairs(units));

export const isCompatable: Curry3<ResolveContext, Units, Units, boolean> =
  curry((context, units1, units2) => isEqual(siUnits(context, units1), siUnits(context, units2)));

export const unitIsLinear: Curry2<ResolveContext, UnitName, boolean> =
  curry((context, unitName) => typeof getConversionDescriptor(context, unitName)[0] === 'number');

export const isLinear: Curry2<ResolveContext, Units, boolean> =
  curry((context, units) => flow(keys, every(unitIsLinear(context)))(units));


type ConversionDirection = number;
const conversionValueNumerator = 1;
const conversionValueDenominator = -1;

const calculateConversionValue = (
  context: ResolveContext,
  direction: ConversionDirection,
  units: Units
) => (quantity: number) => reduce((quantity, unitName) => {
  const siUnitValue = getConversionDescriptor(context, unitName)[0];

  if (typeof siUnitValue === 'number') {
    return quantity * Math.pow(siUnitValue, units[unitName] * direction);
  } else if (direction === conversionValueNumerator) {
    return siUnitValue.convertFromBase(quantity);
  }
  return siUnitValue.convertToBase(quantity);
}, quantity, keys(units));

export const convertTo = (context: ResolveContext, units: Units, entity: Entity): ?Entity => {
  if (isEqual(units, entity.units)) return entity;
  if (!isCompatable(context, units, entity.units)) return null;
  const quantity = flow(
    calculateConversionValue(context, conversionValueNumerator, entity.units),
    calculateConversionValue(context, conversionValueDenominator, units)
  )(entity.quantity);
  return { quantity, units };
};
