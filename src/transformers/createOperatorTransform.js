// @flow
import {
  first, last, reduce, zip, flow, map, isEmpty, dropRight, reduceRight, compact,
} from 'lodash/fp';
import { Pattern, CaptureOptions } from '../modules/patternMatcher';
import type { Transformer } from '../modules/createTransformer';
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  NODE_FUNCTION,
  NODE_MISC_GROUP,
} from '../tokenNodeTypes';
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
  FUNCTION_NEGATE,
} from '../functions';
import type { TokenNode, FunctionNode } from '../tokenNodeTypes'; // eslint-disable-line
import { propagateNull, evenIndexElements, oddIndexElements } from '../util';
import { compactMiscGroup } from '../nodeUtil';

type Direction = number;
const FORWARD: Direction = 0;
const BACKWARD: Direction = 1;

const operatorArity = {
  [TOKEN_OPERATOR_EXPONENT]: 2,
  [TOKEN_OPERATOR_MULTIPLY]: 2,
  [TOKEN_OPERATOR_DIVIDE]: 2,
  [TOKEN_OPERATOR_ADD]: 2,
  [TOKEN_OPERATOR_SUBTRACT]: 2,
  [TOKEN_OPERATOR_NEGATE]: 1,
};

const operatorTypes = {
  [TOKEN_OPERATOR_ADD]: FUNCTION_ADD,
  [TOKEN_OPERATOR_SUBTRACT]: FUNCTION_SUBTRACT,
  [TOKEN_OPERATOR_MULTIPLY]: FUNCTION_MULTIPLY,
  [TOKEN_OPERATOR_DIVIDE]: FUNCTION_DIVIDE,
  [TOKEN_OPERATOR_EXPONENT]: FUNCTION_EXPONENT,
  [TOKEN_OPERATOR_NEGATE]: FUNCTION_NEGATE,
};

const unaryBindingDirections = {
  // Factorial is backwards
  [TOKEN_OPERATOR_NEGATE]: FORWARD,
};

const getOperatorTypes = flow(
  oddIndexElements,
  map(first),
  map('type'),
);

const createBilinearNode = (name, lhs, rhs): ?FunctionNode => (
  (isEmpty(lhs) || isEmpty(rhs))
    ? null
    : { type: NODE_FUNCTION, name, args: [lhs, rhs] }
);

const createUnaryNode = (name, argument): ?FunctionNode => ({
  type: NODE_FUNCTION,
  name,
  args: [argument],
});

const createNode = (operatorType, lhs, rhs) => {
  const arity = operatorArity[operatorType];
  const type = operatorTypes[operatorType];

  if (arity === 2) return createBilinearNode(type, lhs, rhs);

  const bindingDirection = unaryBindingDirections[operatorType];
  let leftSide = !isEmpty(lhs) ? lhs : null;
  let rightSide = !isEmpty(rhs) ? rhs : null;
  let argument;

  if (bindingDirection === FORWARD && rightSide && rightSide.type === NODE_MISC_GROUP) {
    argument = first(rightSide.value);
    const miscGroup: TokenNode = { type: NODE_MISC_GROUP, value: rightSide.value.slice(1) };
    rightSide = compactMiscGroup(miscGroup);
  } else if (bindingDirection === FORWARD) {
    argument = rightSide;
    rightSide = null;
  } else if (bindingDirection === BACKWARD && leftSide && leftSide.type === NODE_MISC_GROUP) {
    argument = last(leftSide.value);
    const miscGroup: TokenNode = { type: NODE_MISC_GROUP, value: leftSide.value.slice(1) };
    leftSide = compactMiscGroup(miscGroup);
  } else if (bindingDirection === BACKWARD) {
    argument = leftSide;
    leftSide = null;
  }

  if (!argument) return null;

  const node = createUnaryNode(type, argument);
  const group = compact([leftSide, node, rightSide]);
  const miscGroup: TokenNode = { type: NODE_MISC_GROUP, value: group };
  const value = compactMiscGroup(miscGroup);

  return value;
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
