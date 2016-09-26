// @flow
import { curry, clamp, isEqual, zip } from 'lodash/fp';
import { NODE_ENTITY, NODE_PERCENTAGE, baseColor } from '../types';
import type { ResolverContext, Node, EntityNode, PercentageNode, ColorNode } from '../types'; // eslint-disable-line
import { convertToFundamentalUnits } from '../types/entity';
import {
  FUNCTION_RGB, FUNCTION_RGBA, FUNCTION_HSL, FUNCTION_HSLA, FUNCTION_HSV, FUNCTION_HSVA,
} from '.';
import { mapUnlessNull } from '../../../util';
import type { Curry2 } from '../../../utilTypes';


const toX = (value: number): Curry2<ResolverContext, Node, ?number> => curry((context, node) => {
  if (!node) return null;

  if (node.type === NODE_ENTITY) {
    const fundamental = convertToFundamentalUnits(context, node);
    if (!fundamental) return null;
    return clamp(0, value, node.quantity);
  } else if (node.type === NODE_PERCENTAGE) {
    return (value * node.value) / 100;
  }
  return null;
});

const to360 = toX(360);
const to255 = toX(255);
const to100 = toX(100);
const to1 = toX(1);

const toDegrees = (context: ResolverContext, node: Node): ?number => {
  if (node && node.type === NODE_ENTITY) {
    if (isEqual(node.units, { degree: 1 })) return node.quantity;
    if (isEqual(node.units, { radian: 1 })) return (360 * node.quantity) / (2 * Math.PI);
  }
  return to360(context, node);
};

const converter = (space, transformers) => (
  context: ResolverContext,
  arg1: Node,
  arg2: Node,
  arg3: Node,
  a?: Node
): ?ColorNode => {
  const values = mapUnlessNull(([transformer, value]) => (
    transformer(context, value)
  ), zip(transformers, [arg1, arg2, arg3]));
  if (!values) return null;

  const alpha = a ? to1(context, a) : 1;
  if (typeof alpha !== 'number') return null;

  return { ...baseColor, space, values, alpha };
};

const rgb = converter('rgb', [to255, to255, to255]);
const hsl = converter('hsl', [toDegrees, to100, to100]);
const hsv = converter('hsv', [toDegrees, to100, to100]);

export default [
  [FUNCTION_RGB, null, rgb],
  [FUNCTION_RGBA, null, rgb],
  [FUNCTION_HSL, null, hsl],
  [FUNCTION_HSLA, null, hsl],
  [FUNCTION_HSV, null, hsv],
  [FUNCTION_HSVA, null, hsv],
];
