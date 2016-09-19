// @flow
import {
  first, drop, reduce, isEmpty, isEqual, intersectionWith, keys, size, mapValues, curry, map,
  flatMap, get, every, flow,
} from 'lodash/fp';
import { NODE_ENTITY, NODE_DATE_TIME, NODE_PERCENTAGE } from '.';
import type { ResolverContext, Node, EntityNode, DateTimeNode } from '.'; // eslint-disable-line
import { getFundamentalUnits, groupUnitsByFundamentalDimensions } from './entity';
import * as entityOps from '../functions/entity';
import * as dateTimeOps from '../functions/dateTime';
import * as dateTimeEntityOps from '../functions/dateTimeEntity';
import * as entityPercentageOps from '../functions/entityPercentage';
import { propagateNull } from '../../../util';

const getUnitPowerForGroupedUnits = curry((units, unitGroup) => reduce((power, unitName) => (
  power + units[unitName]
), 0, unitGroup));

const pathsForGroupedUnits = unitGroup => flow(
  keys,
  flatMap(unitName => map(unitPower => [unitName, unitPower], keys(unitGroup[unitName])))
)(unitGroup);

const shouldDivide = (context, leftUnits, rightUnits) => {
  /*
  The logic for this is that you look for units that have the same dimensions on both the left and
  right, and assume they want to divide. If they had { meter: 1 } and { yard: 1 }, they likely want
  to divide. We only look for units that overlap, so { meter: 1 } and { yard: 1, GBP: -1 } will
  still be a division.

  If they have { liter: 1 } and { gallon: 1 }, they would want to divide. However, if they had
  { liter: 1 } and { gallon: 1, mile: -1 }, they still want to divide, but if we did this based on
  fundamental units only, they would not overlap.

  To fix this, we get the fundamental unit powers for each unit. We map this to an object, so the
  above would look like { meter: { 3: ['liter'] } } and { meter: { 3: ['gallon'] } }. We then look
  at the powers for 'liter' and 'gallon' on each side, and if they are equal, we assume a division.

  This is not perfect, because you'd want to divide { meter: 3 } and { gallon: 1 }. This should
  probably be fixed at some point.
  */
  const resolveFundamentalPowers = units => flow(
    groupUnitsByFundamentalDimensions(context),
    mapValues(mapValues(getUnitPowerForGroupedUnits(units))),
  )(units);

  const leftGroupedUnits = resolveFundamentalPowers(leftUnits);
  const rightGroupedUnits = resolveFundamentalPowers(rightUnits);

  const leftPaths = pathsForGroupedUnits(leftGroupedUnits);
  const rightPaths = pathsForGroupedUnits(rightGroupedUnits);

  const overlappingPaths = intersectionWith(isEqual, leftPaths, rightPaths);

  return (overlappingPaths.length > 0) && every(path => (
    get(path, leftGroupedUnits) === get(path, rightGroupedUnits)
  ), overlappingPaths);
};

const combineEntities = (
  context: ResolverContext,
  left: EntityNode,
  right: EntityNode
): ?EntityNode => {
  const leftFundamentalUnits = getFundamentalUnits(context, left.units);
  const rightFundamentalUnits = getFundamentalUnits(context, right.units);

  if (isEmpty(leftFundamentalUnits) || isEmpty(rightFundamentalUnits)) {
    return entityOps.multiply(context, left, right);
  } else if (isEqual(leftFundamentalUnits, rightFundamentalUnits)) {
    return entityOps.add(context, left, right);
  } else if (shouldDivide(context, left.units, right.units)) {
    return size(left.units) < size(right.units)
      ? entityOps.divide(context, left, right)
      : entityOps.divide(context, right, left);
  }
  return entityOps.multiply(context, left, right);
};

const combineDateTimeEntity = (
  context: ResolverContext,
  left: DateTimeNode,
  right: EntityNode
) => (
  left.directionHint === -1
    ? dateTimeEntityOps.subtract(context, left, right)
    : dateTimeEntityOps.add(context, left, right)
);

const combineValues = (context: ResolverContext) => (
  left: Node,
  right: Node
): ?Node => {
  if (left.type === NODE_ENTITY && right.type === NODE_ENTITY) {
    return combineEntities(context, left, right);
  } else if (left.type === NODE_DATE_TIME && right.type === NODE_DATE_TIME) {
    return dateTimeOps.add(context, left, right);
  } else if (left.type === NODE_DATE_TIME && right.type === NODE_ENTITY) {
    return combineDateTimeEntity(context, left, right);
  } else if (left.type === NODE_ENTITY && right.type === NODE_DATE_TIME) {
    return combineDateTimeEntity(context, right, left);
  } else if (left.type === NODE_ENTITY && right.type === NODE_PERCENTAGE) {
    return entityPercentageOps.multiply(context, left, right);
  } else if (left.type === NODE_PERCENTAGE && right.type === NODE_ENTITY) {
    return entityPercentageOps.multiply(context, right, left);
  }
  return null;
};

export const resolve = ( // eslint-disable-line
  context: ResolverContext,
  values: Node[]
): ?Node => reduce(
  propagateNull(combineValues(context)),
  first(values),
  drop(1, values)
);
