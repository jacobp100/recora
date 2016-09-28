// @flow
import Color from 'color-forge';
import { baseColor } from '.';
import type { ResolverContext, ColorNode } from '.';// eslint-disable-line

export const convertSpace = ( // eslint-disable-line
  context: ResolverContext,
  targetColorSpace: string,
  color: ColorNode
): ?ColorNode => {
  const { values, alpha, space } = new Color(color.values, color.alpha, color.space)
    .convert(targetColorSpace);
  return { ...baseColor, values, alpha, space };
};
