// @flow
import { assignWith } from 'lodash/fp';
import { NODE_DATE_TIME } from '.';
import type { ResolverContext, DateTimeNode } from '.'; // eslint-disable-line

export const resolveDefaults = (context: ResolverContext, dateTime: DateTimeNode) => ({
  type: NODE_DATE_TIME,
  value: assignWith((a, b) => (a !== null ? a : b), dateTime.value, context.date),
});
