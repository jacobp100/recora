// @flow
import { NODE_DATE_TIME } from '../types';
import type { ResolverContext, EntityNode, DateTimeNode } from '../types'; // eslint-disable-line
import { convertTo } from '../types/entity';
import { dateTimeToUTCUnix, utcUnixToTz, unixTzToDateTime } from '../util';

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

  return { type: NODE_DATE_TIME, value };
};

const addMath = addSubtractFactory(1);
const subtractMath = addSubtractFactory(-1);


export {
  addMath as add,
  subtractMath as subtract,
};
