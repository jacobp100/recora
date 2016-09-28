// @flow
import { every, reduce, isEmpty, set } from 'lodash/fp';
import { NODE_ENTITY } from '.';
import type { ResolverContext, Units, Node, ConversionNode } from '.'; // eslint-disable-line
import { combineUnits, unitsAreCompatable, convertTo, convertComposite } from '../types/entity';

export const convert = ( // eslint-disable-line
  context: ResolverContext,
  conversion: ConversionNode,
  value: Node
): ?Node => {
  if (value.type === NODE_ENTITY) {
    if (value.virtualConversion) return null;

    const { entityConversion: units, formatting } = conversion;
    const [firstUnit, ...remainingUnits] = units;
    const allUnitsCompatable =
      !isEmpty(remainingUnits) && every(unitsAreCompatable(context, firstUnit), remainingUnits);

    let entity = allUnitsCompatable
      ? convertComposite(context, units, value)
      : convertTo(context, reduce(combineUnits, firstUnit, remainingUnits), value);
    if (!entity) return null;

    entity = set('formatting', formatting, entity);

    return entity;
  }
  return null;
};
