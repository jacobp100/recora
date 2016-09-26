// @flow
import Color from 'color-forge';
import { NODE_COLOR, NODE_ENTITY, NODE_PERCENTAGE, baseColor } from '../types';
import type { ResolverContext, ColorNode, Node } from '../types'; // eslint-disable-line
import {
  FUNCTION_ADD, FUNCTION_SUBTRACT, FUNCTION_MULTIPLY, FUNCTION_DIVIDE, FUNCTION_MIX,
  FUNCTION_SCREEN, FUNCTION_OVERLAY, FUNCTION_DODGE, FUNCTION_BURN,
} from '.';

const operationFactory = operation => (
  context: ResolverContext,
  left: ColorNode,
  right: ColorNode
): ColorNode => {
  const leftColor = new Color(left.values, left.alpha, left.space);
  const rightColor = new Color(right.values, right.alpha, right.space);
  const { values, alpha, space } = leftColor[operation](rightColor);
  return { ...baseColor, values, alpha, space };
};

const createMixer = fn => (
  context: ResolverContext,
  left: ColorNode,
  right: ColorNode,
  valueNode: Node
): ColorNode => {
  const leftColor = new Color(left.values, left.alpha, left.space);
  const rightColor = new Color(right.values, right.alpha, right.space);
  const { values, alpha, space } = leftColor.mix(rightColor, fn(valueNode));
  return { ...baseColor, values, alpha, space };
};

export const add = operationFactory('add');
export const subtract = operationFactory('subtract');
export const multiply = operationFactory('multiply');
export const divide = operationFactory('divide');
export const mix = operationFactory('mix');
export const screen = operationFactory('screen');
export const overlay = operationFactory('overlay');
export const dodge = operationFactory('dodge');
export const burn = operationFactory('burn');

const mixEntity = createMixer(entity => entity.quantity);
const mixPercentage = createMixer(percentage => percentage.value / 100);

export default [
  [FUNCTION_ADD, [NODE_COLOR, NODE_COLOR], add],
  [FUNCTION_SUBTRACT, [NODE_COLOR, NODE_COLOR], subtract],
  [FUNCTION_MULTIPLY, [NODE_COLOR, NODE_COLOR], multiply],
  [FUNCTION_DIVIDE, [NODE_COLOR, NODE_COLOR], divide],
  [FUNCTION_MIX, [NODE_COLOR, NODE_COLOR], mix],
  [FUNCTION_SCREEN, [NODE_COLOR, NODE_COLOR], screen],
  [FUNCTION_OVERLAY, [NODE_COLOR, NODE_COLOR], overlay],
  [FUNCTION_DODGE, [NODE_COLOR, NODE_COLOR], dodge],
  [FUNCTION_BURN, [NODE_COLOR, NODE_COLOR], burn],
  [FUNCTION_MIX, [NODE_COLOR, NODE_COLOR, NODE_ENTITY], mixEntity],
  [FUNCTION_MIX, [NODE_COLOR, NODE_COLOR, NODE_PERCENTAGE], mixPercentage],
];
