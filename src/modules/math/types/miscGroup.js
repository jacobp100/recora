// @flow
import { first, drop, reduce, isEmpty, isEqual, intersection, keys, pick, size } from 'lodash/fp';
import { NODE_ENTITY } from '.';
import type { Node, EntityNode } from '.'; // eslint-disable-line
import type { ResolverContext } from '../resolverContext';
import { getFundamentalUnits } from './entity';
import * as entityOps from '../operations/entity';
import { propagateNull } from '../../../util';

const shouldDivide = (leftFundamentalUnits, rightFundamentalUnits) => {
  const overlap = intersection(keys(leftFundamentalUnits), keys(rightFundamentalUnits));
  const overlappingKeys = pick(overlap);

  return (overlap.length > 0) &&
    isEqual(overlappingKeys(leftFundamentalUnits), overlappingKeys(rightFundamentalUnits));
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
  } else if (shouldDivide(leftFundamentalUnits, rightFundamentalUnits)) {
    return size(leftFundamentalUnits.length) > size(rightFundamentalUnits.length)
      ? entityOps.divide(context, left, right)
      : entityOps.divide(context, right, left);
  }
  return entityOps.multiply(context, left, right);
};

const combineValues = (context: ResolverContext) => (
  left: Node,
  right: Node
): ?Node => {
  if (left.type === NODE_ENTITY && right.type === NODE_ENTITY) {
    const leftEntity: EntityNode = left;
    const rightEntity: EntityNode = right;
    return combineEntities(context, leftEntity, rightEntity);
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
