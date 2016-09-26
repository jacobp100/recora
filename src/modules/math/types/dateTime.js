// @flow
import { assignWith } from 'lodash/fp';
import { baseDateTime } from '.';
import type { ResolverContext, DateTimeNode } from '.'; // eslint-disable-line

/* eslint-disable import/prefer-default-export */
export const resolveDefaults = (context: ResolverContext, dateTime: DateTimeNode) => ({
  ...baseDateTime,
  value: assignWith((a, b) => (a !== null ? a : b), dateTime.value, context.date),
  directionHint: dateTime.directionHint,
});
