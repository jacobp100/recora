// @flow
import Color from 'color-forge';
import { NODE_COLOR, NODE_ENTITY } from '../types';
import type { ResolverContext, EntityNode, ColorNode } from '../types'; // eslint-disable-line
import { isUnitless } from '../types/entity';
import { FUNCTION_MULTIPLY, FUNCTION_DIVIDE, FUNCTION_EXPONENT } from '.';
import { flip2 } from './util';


const evolveColor = (node: ColorNode, evolve: (color: Color) => Color) => {
  const { values, alpha, space } = evolve(new Color(node.values, node.alpha, node.space));
  return { type: NODE_COLOR, values, alpha, space };
};

const evolveWhenUnitless = (evolve: (color: Color, entity: EntityNode) => Color) => (
  context: ResolverContext,
  left: ColorNode,
  right: EntityNode
): ?ColorNode => (
  isUnitless(right)
    ? evolveColor(left, color => evolve(color, right))
    : null
);

const multiplyDivideFactory = direction => evolveWhenUnitless((color, entity) => (
  color.channelMultiply(entity.quantity ** direction)
));

const exponentMath = evolveWhenUnitless((color, entity) => (
  color.exponent(entity.quantity)
));

const multiplyMath = multiplyDivideFactory(1);
const divideMath = multiplyDivideFactory(-1);

export {
  multiplyMath as multiply,
  divideMath as divide,
  exponentMath as exponent,
};

export default [
  [FUNCTION_MULTIPLY, [NODE_COLOR, NODE_ENTITY], multiplyMath],
  [FUNCTION_DIVIDE, [NODE_COLOR, NODE_ENTITY], divideMath],
  [FUNCTION_EXPONENT, [NODE_COLOR, NODE_ENTITY], exponentMath],
  [FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_COLOR], flip2(multiplyMath)],
];
