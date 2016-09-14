// @flow
import { flow, toPairs, map, join } from 'lodash/fp';
import { NODE_ENTITY } from '../math/types';
import type { NodeFormatter } from './types';

const defaultFormatter: NodeFormatter = {
  [NODE_ENTITY]: (context, formattingHints, entity) => {
    const unitsString = flow(
      toPairs,
      map(([unit, power]) => (power === 1 ? unit : `${unit}^${power}`)),
      join(' ')
    )(entity.units);
    return `${entity.quantity} ${unitsString}`;
  },
};
export default defaultFormatter;
