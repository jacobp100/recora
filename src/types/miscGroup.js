// @flow
import { first, drop, reduce, isEmpty, isEqual, intersection, keys, pick, size } from 'lodash/fp';
import { NODE_ENTITY } from '../tokenNodeTypes';
import { toFundamentalUnits } from './entity';
import {
  add as entityAdd, divide as entityDivide, multiply as entityMultiply,
} from '../math/entity';
import { propagateNull } from '../util';

export type MiscGroup = any[];

const shouldDivide = (leftFundamentalUnits, rightFundamentalUnits) => {
  const overlap = intersection(keys(leftFundamentalUnits), keys(rightFundamentalUnits));
  const overlappingKeys = pick(overlap);

  return (overlap.length > 0) &&
    isEqual(overlappingKeys(leftFundamentalUnits), overlappingKeys(rightFundamentalUnits));
};

const combineValues = context => (left, right) => {
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

export const resolveMiscGroup = (context, values) => reduce(
  propagateNull(combineValues(context)),
  first(values),
  drop(1, values)
);
