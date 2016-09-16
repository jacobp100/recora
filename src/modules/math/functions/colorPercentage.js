// @flow
import { NODE_COLOR, NODE_PERCENTAGE } from '../types';
import type { ResolverContext, PercentageNode, ColorNode } from '../types'; // eslint-disable-line
import { FUNCTION_LIGHTEN, FUNCTION_DARKEN, FUNCTION_ADD, FUNCTION_SUBTRACT } from '.';
import { lighten, darken, evolveColor } from './colorUtil';


const lightenDarkenFactory = fn => (
  context: ResolverContext,
  left: ColorNode,
  right: PercentageNode
): ?ColorNode => evolveColor(left, color => fn(color, right.value / 100));

const lightenMath = lightenDarkenFactory(lighten);
const darkenMath = lightenDarkenFactory(darken);

export {
  lightenMath as lighten,
  darkenMath as darken,
};

export default [
  [FUNCTION_LIGHTEN, [NODE_COLOR, NODE_PERCENTAGE], lightenMath],
  [FUNCTION_DARKEN, [NODE_COLOR, NODE_PERCENTAGE], darkenMath],
  [FUNCTION_ADD, [NODE_COLOR, NODE_PERCENTAGE], lightenMath],
  [FUNCTION_SUBTRACT, [NODE_COLOR, NODE_PERCENTAGE], darkenMath],
];
