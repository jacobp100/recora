// @flow
import { flow, toPairs, map, join } from 'lodash/fp';
import Color from 'color-forge';
import { dateTimeToUTCUnix } from '../math/util/date';
import {
  NODE_ASSIGNMENT, NODE_ENTITY, NODE_COMPOSITE_ENTITY, NODE_DATE_TIME, NODE_COLOR,
} from '../math/types';
import type { Locale } from './types';

const hsxFormatter = ([hue, a, b]) => [hue, `${a}%`, `${b}%`];
const colorFormatters = {
  hsl: hsxFormatter,
  hsv: hsxFormatter,
};

const defaultFormatter: Locale = {
  [NODE_ASSIGNMENT]: (context, assignment) => (
    `${assignment.identifier} = ${context.formatter.format(context, assignment.value)}`
  ),
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
      context.formatter.format(context, entity)
    ), compositeEntity.value);
    return formattedEntities.join(' ');
  },
  [NODE_COLOR]: (context, color) => {
    const { asFunction, withAlpha } = color.formatting;
    if (!asFunction) return new Color(color.values, color.alpha, color.space).toHex();

    const { space, values, alpha } = color;

    const functionName = `${space}${withAlpha ? 'a' : ''}`;
    let args = map(Math.round, values);

    if (space in colorFormatters) args = colorFormatters[space](args);
    if (withAlpha) args = args.concat(Math.round(alpha) === alpha ? alpha : alpha.toFixed(2));

    return `${functionName}(${args.join(', ')})`;
  },
  [NODE_DATE_TIME]: (context, dateTime) => (
    new Date(dateTimeToUTCUnix(dateTime)).toISOString()
  ),
};
export default defaultFormatter;
