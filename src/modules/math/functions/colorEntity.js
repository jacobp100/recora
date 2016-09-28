// @flow
import { NODE_COLOR, NODE_ENTITY } from '../types';
import type { ResolverContext, EntityNode, ColorNode } from '../types'; // eslint-disable-line
import {
  FUNCTION_LIGHTEN, FUNCTION_DARKEN, FUNCTION_MULTIPLY, FUNCTION_DIVIDE, FUNCTION_EXPONENT,
} from '.';
import { flip2 } from '../util/functions';
import { lighten, darken, evolveWhenUnitless } from '../util/color';


const lightenDarkenFactory = fn => evolveWhenUnitless((color, entity) => (
  fn(color, entity.quantity)
));

const multiplyDivideFactory = direction => evolveWhenUnitless((color, entity) => (
  color.channelMultiply(entity.quantity ** direction)
));

const exponentMath = evolveWhenUnitless((color, entity) => (
  color.exponent(entity.quantity)
));

const lightenMath = lightenDarkenFactory(lighten);
const darkenMath = lightenDarkenFactory(darken);
const multiplyMath = multiplyDivideFactory(1);
const divideMath = multiplyDivideFactory(-1);

export {
  lightenMath as lighten,
  darkenMath as darken,
  multiplyMath as multiply,
  divideMath as divide,
  exponentMath as exponent,
};

export default [
  [FUNCTION_LIGHTEN, [NODE_COLOR, NODE_ENTITY], lightenMath],
  [FUNCTION_DARKEN, [NODE_COLOR, NODE_ENTITY], darkenMath],
  [FUNCTION_MULTIPLY, [NODE_COLOR, NODE_ENTITY], multiplyMath],
  [FUNCTION_DIVIDE, [NODE_COLOR, NODE_ENTITY], divideMath],
  [FUNCTION_EXPONENT, [NODE_COLOR, NODE_ENTITY], exponentMath],
  [FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_COLOR], flip2(multiplyMath)],
];
