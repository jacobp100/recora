// @flow
import {
  first, last, reduce, zip, flow, map, isEmpty, dropRight, reduceRight, compact,
} from 'lodash/fp';
import { Pattern, CaptureOptions } from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  TOKEN_OPERATOR_FACTORIAL,
} from '../tokenTypes';
import { NODE_FUNCTION, NODE_MISC_GROUP } from '../modules/math/types';
import type { Node, FunctionNode } from '../modules/math/types'; // eslint-disable-line
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
  FUNCTION_NEGATE,
  FUNCTION_FACTORIAL,
} from '../modules/math/functions';
import { propagateNull, evenIndexElements, oddIndexElements, singleArrayValue } from '../util';
import { compactMiscGroup } from './util';

type Direction = number;
const FORWARD: Direction = 0;
const BACKWARD: Direction = 1;

const operatorTypes = {
  [TOKEN_OPERATOR_ADD]: FUNCTION_ADD,
  [TOKEN_OPERATOR_SUBTRACT]: FUNCTION_SUBTRACT,
  [TOKEN_OPERATOR_MULTIPLY]: FUNCTION_MULTIPLY,
  [TOKEN_OPERATOR_DIVIDE]: FUNCTION_DIVIDE,
  [TOKEN_OPERATOR_EXPONENT]: FUNCTION_EXPONENT,
  [TOKEN_OPERATOR_NEGATE]: FUNCTION_NEGATE,
  [TOKEN_OPERATOR_FACTORIAL]: FUNCTION_FACTORIAL,
};

const operatorArity = {
  [FUNCTION_ADD]: 2,
  [FUNCTION_SUBTRACT]: 2,
  [FUNCTION_MULTIPLY]: 2,
  [FUNCTION_DIVIDE]: 2,
  [FUNCTION_EXPONENT]: 2,
  [FUNCTION_NEGATE]: 1,
  [FUNCTION_FACTORIAL]: 1,
};

const unaryBindingDirections = {
  [FUNCTION_NEGATE]: FORWARD,
  [FUNCTION_FACTORIAL]: BACKWARD,
};


const getOperatorTypes = flow(
  oddIndexElements,
  map(first),
  map('type'),
);

const createBilinearNode = (name, leftSegment, rightSegment): ?FunctionNode => {
  const lhs = singleArrayValue(leftSegment);
  const rhs = singleArrayValue(rightSegment);

  return (lhs && rhs)
    ? { type: NODE_FUNCTION, name, args: [lhs, rhs] }
    : null;
};

const createUnaryNode = (bindingDirection, name, leftSegment, rightSegment): ?FunctionNode => {
  let leftSide = !isEmpty(leftSegment) ? leftSegment : null;
  let rightSide = !isEmpty(rightSegment) ? rightSegment : null;
  let argument;

  if (bindingDirection === FORWARD && rightSide && rightSide.type === NODE_MISC_GROUP) {
    argument = first(rightSide.value);
    const miscGroup: Node = { type: NODE_MISC_GROUP, value: rightSide.value.slice(1) };
    rightSide = compactMiscGroup(miscGroup);
  } else if (bindingDirection === FORWARD) {
    argument = rightSide;
    rightSide = null;
  } else if (bindingDirection === BACKWARD && leftSide && leftSide.type === NODE_MISC_GROUP) {
    argument = last(leftSide.value);
    const miscGroup: Node = { type: NODE_MISC_GROUP, value: leftSide.value.slice(1) };
    leftSide = compactMiscGroup(miscGroup);
  } else if (bindingDirection === BACKWARD) {
    argument = leftSide;
    leftSide = null;
  }

  if (!argument) return null;

  const node = {
    type: NODE_FUNCTION,
    name,
    args: [argument],
  };
  const group = compact([leftSide, node, rightSide]);
  const miscGroup: Node = { type: NODE_MISC_GROUP, value: group };
  const value = compactMiscGroup(miscGroup);

  return value;
};

const createNode = (operatorType, leftSegment, rightSegment) => {
  const name = operatorTypes[operatorType];
  const arity = operatorArity[name];

  if (arity === 2) {
    return createBilinearNode(name, leftSegment, rightSegment);
  }
  const bindingDirection = unaryBindingDirections[name];
  return createUnaryNode(bindingDirection, name, leftSegment, rightSegment);
};

const createPattern = (operators: string[]) => (
  new Pattern([
    new CaptureOptions(operators).negate().lazy().any(),
    new Pattern([
      new CaptureOptions(operators),
      new CaptureOptions(operators).negate().lazy().any(),
    ]).oneOrMore(),
  ])
);

export const createForwardOperatorTransform = (operators: string[]): Transformer => ({
  pattern: createPattern(operators),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const operatorTypes = getOperatorTypes(captureGroups);
    const [initialSegment, ...remainingSegments] = segments;

    return reduce(propagateNull((lhs, [operator, rhs]) => (
      createNode(operator, lhs, rhs)
    )), initialSegment, zip(operatorTypes, remainingSegments));
  }),
});

export const createBackwardOperatorTransform = (operators: string[]): Transformer => ({
  pattern: createPattern(operators),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const operatorTypes = getOperatorTypes(captureGroups);
    const initialSegment = last(segments);
    const remainingSegments = dropRight(1, segments);

    return reduceRight(propagateNull((lhs, [operator, rhs]) => (
      createNode(operator, rhs, lhs)
    )), initialSegment, zip(operatorTypes, remainingSegments));
  }),
});
