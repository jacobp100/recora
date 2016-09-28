// @flow
import { every, reduce, isEmpty, set, endsWith } from 'lodash/fp';
import { NODE_ENTITY, NODE_COLOR } from '.';
import type { ResolverContext, Units, Node, ConversionNode } from '.'; // eslint-disable-line
import { combineUnits, unitsAreCompatable, convertTo, convertComposite } from '../types/entity';
import { convertSpace } from '../types/color';

export const convert = ( // eslint-disable-line
  context: ResolverContext,
  conversion: ConversionNode,
  value: Node
): ?Node => {
  if (value.type === NODE_ENTITY && !isEmpty(value.pseudoConversion)) return null;
  if (value.type !== NODE_ENTITY && !isEmpty(value.entityConversion)) return null;

  switch (value.type) {
    case NODE_ENTITY: {
      const units = conversion.entityConversion;
      let entity = value;

      if (!isEmpty(units)) {
        const [firstUnit, ...remainingUnits] = units;
        const allUnitsCompatable =
          !isEmpty(remainingUnits) && every(unitsAreCompatable(context, firstUnit), remainingUnits);

        entity = allUnitsCompatable
          ? convertComposite(context, units, entity)
          : convertTo(context, reduce(combineUnits, firstUnit, remainingUnits), entity);
      }

      if (!entity) return null;
      entity = set('formatting', conversion.formatting, entity);

      return entity;
    }
    case NODE_COLOR: {
      const conversionSpace = conversion.pseudoConversion;
      let color = value;
      let { formatting } = conversion;

      if (conversionSpace) {
        const hasAlphaComponent = endsWith('a', conversionSpace);
        const targetColorSpace = hasAlphaComponent
          ? conversionSpace.slice(0, -1)
          : conversionSpace;

        color = convertSpace(context, targetColorSpace, color);
        formatting = { ...formatting, asFunction: true, withAlpha: hasAlphaComponent };
      }

      color = set('formatting', formatting, color);

      return color;
    }
    default:
      return null;
  }
};
