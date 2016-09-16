// @flow
import Color from 'color-forge';
import { NODE_COLOR } from '../types';
import type { ResolverContext, ColorNode } from '../types'; // eslint-disable-line
import { FUNCTION_ADD, FUNCTION_SUBTRACT, FUNCTION_MULTIPLY, FUNCTION_DIVIDE } from '.';

const operationFactory = operation => (
  context: ResolverContext,
  left: ColorNode,
  right: ColorNode
): ColorNode => {
  const leftColor = new Color(left.values, left.alpha, left.space);
  const rightColor = new Color(right.values, right.alpha, right.space);
  const { values, alpha, space } = leftColor[operation](rightColor);
  return { type: NODE_COLOR, values, alpha, space };
};

export const add = operationFactory('add');
export const subtract = operationFactory('subtract');
export const multiply = operationFactory('multiply');
export const divide = operationFactory('divide');
export const screen = operationFactory('screen');
export const overlay = operationFactory('overlay');
export const dodge = operationFactory('dodge');
export const burn = operationFactory('burn');

export default [
  [FUNCTION_ADD, [NODE_COLOR, NODE_COLOR], add],
  [FUNCTION_SUBTRACT, [NODE_COLOR, NODE_COLOR], subtract],
  [FUNCTION_MULTIPLY, [NODE_COLOR, NODE_COLOR], multiply],
  [FUNCTION_DIVIDE, [NODE_COLOR, NODE_COLOR], divide],
];
