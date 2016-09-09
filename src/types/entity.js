// @flow
import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, every, curry,
} from 'lodash/fp';
import type { ConversionDescriptor, UnitName, Units } from '../data/units';
import type { Curry2, Curry3 } from '../utilTypes';
import type { ResolverContext } from '../resolverContext';

export type Entity = { quantity: number, units: Units };

const getConversionDescriptor = (
  context: ResolverContext,
  unitName: UnitName,
): ConversionDescriptor => {
  const siUnitDescriptor = context.conversionDescriptors[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};

const addUnitValues = (lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0));

export const combineUnits: Curry2<Units, Units, Units> =
  curry((units1, units2) => flow(mergeWith(addUnitValues), omitBy(eq(0)))(units1, units2));

export const toFundamentalUnits = (
  context: ResolverContext,
  units: Units
): Units => reduce((accum, [unitName, unitValue]) => {
  const siUnitDimensions = getConversionDescriptor(context, unitName)[1];
  const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
  return combineUnits(scaledSiUnitDimensions, accum);
}, {}, toPairs(units));

export const unitsAreCompatable: Curry3<ResolverContext, Units, Units, boolean> =
  curry((context, units1, units2) => (
    isEqual(toFundamentalUnits(context, units1), toFundamentalUnits(context, units2))
  ));

export const unitIsLinear: Curry2<ResolverContext, UnitName, boolean> =
  curry((context, unitName) => typeof getConversionDescriptor(context, unitName)[0] === 'number');

export const unitsAreLinear: Curry2<ResolverContext, Units, boolean> =
  curry((context, units) => flow(keys, every(unitIsLinear(context)))(units));


type ConversionDirection = number;
const conversionValueNumerator = 1;
const conversionValueDenominator = -1;

const calculateConversionValue = (
  context: ResolverContext,
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

export const convertTo = (context: ResolverContext, units: Units, entity: Entity): ?Entity => {
  if (isEqual(units, entity.units)) return entity;
  if (!unitsAreCompatable(context, units, entity.units)) return null;
  const quantity = flow(
    calculateConversionValue(context, conversionValueNumerator, entity.units),
    calculateConversionValue(context, conversionValueDenominator, units)
  )(entity.quantity);
  return { quantity, units };
};

export const convertToFundamentalUnits = (
  context: ResolverContext,
  entity: Entity,
): ?Entity => convertTo(context, toFundamentalUnits(entity.units), entity);
