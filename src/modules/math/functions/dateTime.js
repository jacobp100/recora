// @flow
import { NODE_DATE_TIME, baseEntity } from '../types';
import type { ResolverContext, EntityNode, DateTimeNode } from '../types'; // eslint-disable-line
import { convertTo } from '../types/entity';
import { dateTimeToUTCUnix } from '../util/date';
import { FUNCTION_ADD, FUNCTION_SUBTRACT } from '.';

const addSubtract = (
  context: ResolverContext,
  left: DateTimeNode,
  right: DateTimeNode
): ?EntityNode => {
  const leftUtcUnix = dateTimeToUTCUnix(left.value);
  const rightUtcUnix = dateTimeToUTCUnix(right.value);
  const milliseconds = Math.abs(leftUtcUnix - rightUtcUnix);

  const dateEntity: EntityNode = {
    ...baseEntity,
    quantity: milliseconds,
    units: { millisecond: 1 },
  };

  if (milliseconds > 86400000) {
    return convertTo(context, { day: 1 }, dateEntity);
  } else if (milliseconds > 3600000) {
    return convertTo(context, { hour: 1 }, dateEntity);
  } else if (milliseconds > 60000) {
    return convertTo(context, { minute: 1 }, dateEntity);
  } else if (milliseconds > 1000) {
    return convertTo(context, { second: 1 }, dateEntity);
  }
  return dateEntity;
};

export {
  addSubtract as add,
  addSubtract as subtract,
};

export default [
  [FUNCTION_ADD, [NODE_DATE_TIME, NODE_DATE_TIME], addSubtract],
  [FUNCTION_SUBTRACT, [NODE_DATE_TIME, NODE_DATE_TIME], addSubtract],
];
