// @flow
import { NODE_DATE_TIME, NODE_ENTITY } from '../types';
import type { ResolverContext, EntityNode, DateTimeNode } from '../types'; // eslint-disable-line
import { convertTo } from '../types/entity';
import { dateTimeToUTCUnix, utcUnixToTz, unixTzToDateTime } from '../util';
import { FUNCTION_ADD, FUNCTION_SUBTRACT } from '.';
import { flip2 } from './util';

const addSubtractFactory = direction => (
  context: ResolverContext,
  left: DateTimeNode,
  right: EntityNode
): ?DateTimeNode => {
  const millisecondsEntity = convertTo(context, { millisecond: 1 }, right);
  if (!millisecondsEntity) return null;

  const utcUnix = dateTimeToUTCUnix(left.value);
  const offset = millisecondsEntity.quantity;
  const newUtcUnix = utcUnix + (offset * direction);
  const newUnix = utcUnixToTz(newUtcUnix, left.value.timezone);

  const value = unixTzToDateTime(newUnix, left.value.timezone);

  return { type: NODE_DATE_TIME, value, directionHint: 1 };
};

const addMath = addSubtractFactory(1);
const subtractMath = addSubtractFactory(-1);


export {
  addMath as add,
  subtractMath as subtract,
};

export default [
  [FUNCTION_ADD, [NODE_DATE_TIME, NODE_ENTITY], addMath],
  [FUNCTION_SUBTRACT, [NODE_DATE_TIME, NODE_ENTITY], subtractMath],
  [FUNCTION_ADD, [NODE_ENTITY, NODE_DATE_TIME], flip2(addMath)],
];
