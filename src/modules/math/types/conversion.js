// @flow
import { every, reduce, isEmpty } from 'lodash/fp';
import { NODE_ENTITY } from '.';
import type { ResolverContext, Units, Node } from '.'; // eslint-disable-line
import { combineUnits, unitsAreCompatable, convertTo } from '../types/entity';

export const convert = ( // eslint-disable-line
  context: ResolverContext,
  units: Units[],
  value: Node
): ?Node => {
  if (value.type !== NODE_ENTITY) return null;

  const [firstUnit, ...remainingUnits] = units;
  const allUnitsCompatable =
    !isEmpty(remainingUnits) && every(unitsAreCompatable(context, firstUnit), remainingUnits);

  if (allUnitsCompatable) return null; // SPLIT UNITS

  const combinedUnits = reduce(combineUnits, firstUnit, remainingUnits);
  return convertTo(context, combinedUnits, value);
};
