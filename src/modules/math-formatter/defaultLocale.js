// @flow
import { flow, toPairs, map, join, endsWith } from 'lodash/fp';
import Color from 'color-forge';
import { dateTimeToUTCUnix } from '../math/util';
import { NODE_ENTITY, NODE_COMPOSITE_ENTITY, NODE_DATE_TIME, NODE_COLOR } from '../math/types';
import type { Locale } from './types';

const hsxFormatter = ([hue, a, b]) => [hue, `${a}%`, `${b}%`];
const colorFormatters = {
  hsl: hsxFormatter,
  hsv: hsxFormatter,
};

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
  [NODE_COLOR]: (context, color) => {
    const spaceFormatting = color.formatting.space;
    if (!spaceFormatting) return new Color(color.values, color.alpha, color.space).toHex();

    const [baseSpace, hasAlpha] = endsWith('a', spaceFormatting)
      ? [spaceFormatting.slice(0, -1), true]
      : [spaceFormatting, false];

    let args = map(Math.round, color.values);

    if (baseSpace in colorFormatters) {
      args = colorFormatters[baseSpace](args);
    }

    if (hasAlpha) {
      const { alpha } = color;
      const alphaString = Math.round(alpha) === alpha ? alpha : alpha.toFixed(2);
      args = args.concat(alphaString);
    }

    return `${spaceFormatting}(${args.join(', ')})`;
  },
  [NODE_DATE_TIME]: (context, dateTime) => (
    new Date(dateTimeToUTCUnix(dateTime)).toISOString()
  ),
};
export default defaultFormatter;
