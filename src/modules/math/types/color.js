// @flow
import type { ResolverContext, ColorNode } from '.'; // eslint-disable-line
import { evolveColor } from '../util/color';

export const convertSpace = ( // eslint-disable-line
  context: ResolverContext,
  targetColorSpace: string,
  color: ColorNode
): ?ColorNode => (
  evolveColor(color, color => color.convert(targetColorSpace))
);
