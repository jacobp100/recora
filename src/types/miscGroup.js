// @flow
import { first, drop, reduce, isEmpty, isEqual, intersection, keys, pick, size } from 'lodash/fp';
import { NODE_ENTITY } from '../tokenNodeTypes';
import type { TokenNode, EntityNode } from '../tokenNodeTypes'; // eslint-disable-line
import type { ResolverContext } from '../resolverContext';
import { toFundamentalUnits } from './entity';
import {
  add as entityAdd, divide as entityDivide, multiply as entityMultiply,
} from '../math/entity';
import { propagateNull } from '../util';

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
  const leftFundamentalUnits = toFundamentalUnits(context, left.units);
  const rightFundamentalUnits = toFundamentalUnits(context, right.units);

  if (isEmpty(leftFundamentalUnits) || isEmpty(rightFundamentalUnits)) {
    return entityMultiply(context, left, right);
  } else if (isEqual(leftFundamentalUnits, rightFundamentalUnits)) {
    return entityAdd(context, left, right);
  } else if (shouldDivide(leftFundamentalUnits, rightFundamentalUnits)) {
    return size(leftFundamentalUnits.length) > size(rightFundamentalUnits.length)
      ? entityDivide(context, left, right)
      : entityDivide(context, right, left);
  }
  return entityMultiply(context, left, right);
};

const combineValues = (context: ResolverContext) => (
  left: TokenNode,
  right: TokenNode
): ?TokenNode => {
  if (left.type === NODE_ENTITY && right.type === NODE_ENTITY) {
    const leftEntity: EntityNode = left;
    const rightEntity: EntityNode = right;
    return combineEntities(context, leftEntity, rightEntity);
  }
  return null;
};

export const resolveMiscGroup = ( // eslint-disable-line
  context: ResolverContext,
  values: TokenNode[]
): ?TokenNode => reduce(
  propagateNull(combineValues(context)),
  first(values),
  drop(1, values)
);
