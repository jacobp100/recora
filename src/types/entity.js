// @flow
import {
  keys, flow, mergeWith, omitBy, eq, reduce, toPairs, mapValues, multiply, isEqual, every, curry,
} from 'lodash/fp';
import type { ConversionDescriptor, UnitName, Units } from '../data/units';
import { NODE_ENTITY } from '../tokenNodeTypes';
import type { EntityNode } from '../tokenNodeTypes'; // eslint-disable-line
import type { Curry2, Curry3 } from '../utilTypes';
import type { ResolverContext } from '../resolverContext';

const getConversionDescriptor = (
  context: ResolverContext,
  unitName: UnitName,
): ConversionDescriptor => {
  const siUnitDescriptor = context.conversionDescriptors[unitName];
  if (!siUnitDescriptor) throw new Error(`${unitName} is not defined`);
  return siUnitDescriptor;
};

const addUnitValues = (lhsUnitValue, rhsUnitValue) => ((lhsUnitValue || 0) + (rhsUnitValue || 0));

const unitIsLinear: Curry2<ResolverContext, UnitName, boolean> =
  curry((context, unitName) => typeof getConversionDescriptor(context, unitName)[0] === 'number');

export const combineUnits: Curry2<Units, Units, Units> =
  curry((units1, units2) => flow(mergeWith(addUnitValues), omitBy(eq(0)))(units1, units2));

export const toFundamentalUnits: Curry2<ResolverContext, Units, Units> = curry((context, units) => (
  reduce((accum, [unitName, unitValue]) => {
    const siUnitDimensions = getConversionDescriptor(context, unitName)[1];
    const scaledSiUnitDimensions = mapValues(multiply(unitValue), siUnitDimensions);
    return combineUnits(scaledSiUnitDimensions, accum);
  }, {}, toPairs(units))
));

export const unitsAreLinear: Curry2<ResolverContext, Units, boolean> =
  curry((context, units) => flow(keys, every(unitIsLinear(context)))(units));

export const unitsAreCompatable: Curry3<ResolverContext, Units, Units, boolean> =
  curry((context, units1, units2) => (
    isEqual(toFundamentalUnits(context, units1), toFundamentalUnits(context, units2))
  ));

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
