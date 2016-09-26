// @flow
import Color from 'color-forge';
import { baseColor } from '../types';
import type { ResolverContext, EntityNode, ColorNode } from '../types'; // eslint-disable-line
import { isUnitless } from '../types/entity';

export const evolveColor = (node: ColorNode, evolve: (color: Color) => Color) => {
  const { values, alpha, space } = evolve(new Color(node.values, node.alpha, node.space));
  return { ...baseColor, values, alpha, space };
};

export const evolveWhenUnitless = (evolve: (color: Color, entity: EntityNode) => Color) => (
  context: ResolverContext,
  left: ColorNode,
  right: EntityNode
): ?ColorNode => (
  isUnitless(right)
    ? evolveColor(left, color => evolve(color, right))
    : null
);

export const lighten =
  (node: ColorNode, value: number) => evolveColor(node, color => color.lighten(value));
export const darken =
  (node: ColorNode, value: number) => evolveColor(node, color => color.darken(value));
