// @flow
import { every, reduce, isEmpty, set, endsWith } from 'lodash/fp';
import Color from 'color-forge';
import { NODE_ENTITY, NODE_COLOR, baseColor } from '.';
import type { ResolverContext, Units, Node, ConversionNode } from '.'; // eslint-disable-line
import { combineUnits, unitsAreCompatable, convertTo, convertComposite } from '../types/entity';

export const convert = ( // eslint-disable-line
  context: ResolverContext,
  conversion: ConversionNode,
  value: Node
): ?Node => {
  if (value.type === NODE_ENTITY && value.pseudoConversion) return null;
  if (value.type !== NODE_ENTITY && value.entityConversion) return null;

  switch (value.type) {
    case NODE_ENTITY: {
      const units = conversion.entityConversion;
      let entity;

      if (!isEmpty(units)) {
        const [firstUnit, ...remainingUnits] = units;
        const allUnitsCompatable =
          !isEmpty(remainingUnits) && every(unitsAreCompatable(context, firstUnit), remainingUnits);

        entity = allUnitsCompatable
          ? convertComposite(context, units, value)
          : convertTo(context, reduce(combineUnits, firstUnit, remainingUnits), value);
        if (!entity) return null;
      }

      entity = set('formatting', conversion.formatting, entity);

      return entity;
    }
    case NODE_COLOR: {
      const conversionSpace = conversion.pseudoConversion;

      let color = value;
      let { formatting } = conversion;

      if (conversionSpace) {
        const targetColorSpace = endsWith('a', conversionSpace)
          ? conversionSpace.slice(0, -1)
          : conversionSpace;

        const { values, alpha, space } = new Color(value.values, value.alpha, value.space)
          .convert(targetColorSpace);
        color = { ...baseColor, values, alpha, space };

        formatting = set('space', conversionSpace, formatting);
      }

      color = set('formatting', formatting, color);

      return color;
    }
    default:
      return null;
  }
};
