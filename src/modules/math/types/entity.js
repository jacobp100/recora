// @flow
import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, every, curry,
  isEmpty, sortBy, set, size, map, filter, groupBy, values, flatMap, fromPairs, some, overEvery,
  reject, flatten,
} from 'lodash/fp';
import { NODE_ENTITY, NODE_COMPOSITE_ENTITY } from '.';
import type { // eslint-disable-line
  ResolverContext, ConversionDescriptor, UnitName, Units, EntityNode, CompositeEntityNode,
} from '.';
import type { Curry2, Curry3 } from '../../../utilTypes';
import { propagateNull, mapUnlessNull } from '../../../util';

const getConversionDescriptor = (
  context: ResolverContext,
  unitName: UnitName,
): ConversionDescriptor => {
  const siUnitDescriptor = context.conversionDescriptors[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};


// Unit utils
const addUnitValues = (lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0));

const unitIsLinear: Curry2<ResolverContext, UnitName, boolean> =
  curry((context, unitName) => typeof getConversionDescriptor(context, unitName)[0] === 'number');

export const combineUnits: Curry2<Units, Units, Units> =
  curry((units1, units2) => flow(mergeWith(addUnitValues), omitBy(eq(0)))(units1, units2));

export const getFundamentalUnits: Curry2<ResolverContext, Units, Units> =
  curry((context, units) => reduce((accum, [unitName, unitValue]) => {
    const siUnitDimensions = getConversionDescriptor(context, unitName)[1];
    const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
    return combineUnits(scaledSiUnitDimensions, accum);
  }, {}, toPairs(units)));

export const unitsAreLinear: Curry2<ResolverContext, Units, boolean> =
  curry((context, units) => flow(keys, every(unitIsLinear(context)))(units));

export const unitsAreCompatable: Curry3<ResolverContext, Units, Units, boolean> =
  curry((context, units1, units2) => (
    isEqual(getFundamentalUnits(context, units1), getFundamentalUnits(context, units2))
  ));

export const groupUnitsByFundamentalDimensions = curry((
  context: ResolverContext,
  units: Units
): { [key: UnitName]: { [key: number]: UnitName[] } } => {
  const unitNames = keys(units);
  const unitsWithOneFundamentalQuantity = filter(unitName => (
    size(getConversionDescriptor(context, unitName)[1]) === 1
  ), unitNames);

  const unitsGroupedByFundamentalType = groupBy(unitName => (
    keys(getConversionDescriptor(context, unitName)[1])[0]
  ), unitsWithOneFundamentalQuantity);

  const unitsGroupedByFundamentalTypeThenFundamentalPower = mapValues(groupBy(unitName => (
    values(getConversionDescriptor(context, unitName)[1])[0]
  )), unitsGroupedByFundamentalType);

  return unitsGroupedByFundamentalTypeThenFundamentalPower;
});


// Entity utils
export const isUnitless = (entity: EntityNode): bool => isEmpty(entity.units);

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

export const convertTo = (
  context: ResolverContext,
  units: Units,
  entity: EntityNode
): ?EntityNode => {
  if (isEqual(units, entity.units)) return entity;
  if (!unitsAreCompatable(context, units, entity.units)) return null;
  const quantity = flow(
    calculateConversionValue(context, conversionValueNumerator, entity.units),
    calculateConversionValue(context, conversionValueDenominator, units)
  )(entity.quantity);
  return { type: NODE_ENTITY, quantity, units };
};

export const convertToFundamentalUnits = (
  context: ResolverContext,
  entity: EntityNode
): ?EntityNode => (
  convertTo(context, getFundamentalUnits(context, entity.units), entity)
);

export const convertComposite = (
  context: ResolverContext,
  units: Units[],
  entity: EntityNode
): ?CompositeEntityNode => {
  const unitNames = mapUnlessNull(unit => (
    size(unit) === 1 ? keys(unit)[0] : null
  ), units);

  if (!unitNames) return null;

  const sortedUnitNames = sortBy(unit => (
    -Number(getConversionDescriptor(context, unit)[0])
  ), unitNames);
  const sortedUnits = map(unit => ({ [unit]: 1 }), sortedUnitNames);

  const result = reduce(propagateNull((accum, unit) => {
    const convertedEntity = convertTo(context, unit, accum.remainder);
    if (!convertedEntity) return null;

    const { quantity } = convertedEntity;

    // Add small amount to account for rounding errors
    const compositeQuantity = Math.floor(quantity + 1E-6);
    const remainderQuantity = quantity - compositeQuantity;

    return {
      composite: accum.composite.concat(set('quantity', compositeQuantity, convertedEntity)),
      remainder: set('quantity', remainderQuantity, convertedEntity),
    };
  }), {
    remainder: entity,
    composite: [],
  }, sortedUnits);

  if (!result) return null;

  return { type: NODE_COMPOSITE_ENTITY, value: result.composite };
};

// If you have lhs = x meter^-1 yard, convert to unitless
export const simplifyUnits = (
  context: ResolverContext,
  entity: EntityNode
): ?EntityNode => {
  const allUnitGroups: (UnitName[])[] = flow(
    groupUnitsByFundamentalDimensions(context),
    values,
    flatMap(values)
  )(entity.units);

  // If a unit group has both positive and negative powers
  // { yard: -1 meter: 1 } is rejected, but { yard: 1, meter: 1 } is not
  const unitsToConvertTo = reject(overEvery([
    some(unit => entity.units[unit] > 0),
    some(unit => entity.units[unit] < 0),
  ]), allUnitGroups);

  if (size(entity.units) === unitsToConvertTo.length) return entity;

  const conversionUnits = flow(
    flatten,
    map(unit => [unit, entity.units[unit]]),
    fromPairs
  )(unitsToConvertTo);

  return convertTo(context, conversionUnits, entity);
};
