// @flow
import { every, reduce, isEmpty } from 'lodash/fp';
import type { ResolverContext } from '../resolverContext';
import { NODE_ENTITY } from '../tokenNodeTypes';
import type { TokenNode } from '../tokenNodeTypes'; // eslint-disable-line
import type { Units } from '../data/units';
import { combineUnits, unitsAreCompatable, convertTo } from '../types/entity';

export const convert = ( // eslint-disable-line
  context: ResolverContext,
  units: Units,
  value: TokenNode
): ?TokenNode => {
  if (value.type !== NODE_ENTITY) return null;

  const [firstUnit, ...remainingUnits] = units;
  const allUnitsCompatable =
  !isEmpty(remainingUnits) && every(unitsAreCompatable(context, firstUnit), remainingUnits);

  if (allUnitsCompatable) return null; // SPLIT UNITS

  const combinedUnits = reduce(combineUnits, firstUnit, remainingUnits);
  return convertTo(context, combinedUnits, value);
};
