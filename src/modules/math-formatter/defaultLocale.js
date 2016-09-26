// @flow
import { flow, toPairs, map, join } from 'lodash/fp';
import { dateTimeToUTCUnix } from '../math/util';
import { NODE_ENTITY, NODE_COMPOSITE_ENTITY, NODE_DATE_TIME } from '../math/types';
import type { Locale } from './types';

const defaultFormatter: Locale = {
  [NODE_ENTITY]: (context, entity) => {
    const unitsString = flow(
      toPairs,
      map(([unit, power]) => (power === 1 ? unit : `${unit}^${power}`)),
      join(' ')
    )(entity.units);
    return `${entity.quantity} ${unitsString}`;
  },
  [NODE_COMPOSITE_ENTITY]: (context, compositeEntity) => {
    const formattedEntities = map(entity => (
      context.formatter.format(entity)
    ), compositeEntity.value);
    return formattedEntities.join(' ');
  },
  [NODE_DATE_TIME]: (context, dateTime) => (
    new Date(dateTimeToUTCUnix(dateTime)).toISOString()
  ),
};
export default defaultFormatter;
