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
  NODE_OPERATOR_UNARY,
  NODE_OPERATOR_BILINEAR,
  NODE_MISC_GROUP,
} from '../types';
import type { TokenType } from '../types'; // eslint-disable-line
import { propagateNull, evenIndexElements, oddIndexElements } from '../util';

type Direction = number;
export const FORWARD: Direction = 0;
export const BACKWARD: Direction = 1;

const operatorArity = {
  [TOKEN_OPERATOR_EXPONENT]: NODE_OPERATOR_BILINEAR,
  [TOKEN_OPERATOR_MULTIPLY]: NODE_OPERATOR_BILINEAR,
  [TOKEN_OPERATOR_DIVIDE]: NODE_OPERATOR_BILINEAR,
  [TOKEN_OPERATOR_ADD]: NODE_OPERATOR_BILINEAR,
  [TOKEN_OPERATOR_SUBTRACT]: NODE_OPERATOR_BILINEAR,
  [TOKEN_OPERATOR_NEGATE]: NODE_OPERATOR_UNARY,
};

const operatorTypes = {
  [TOKEN_OPERATOR_EXPONENT]: 'exponent',
  [TOKEN_OPERATOR_MULTIPLY]: 'multiply',
  [TOKEN_OPERATOR_DIVIDE]: 'divide',
  [TOKEN_OPERATOR_ADD]: 'add',
  [TOKEN_OPERATOR_SUBTRACT]: 'subtract',
  [TOKEN_OPERATOR_NEGATE]: 'negate',
};

const unaryBindingDirections = {
  [TOKEN_OPERATOR_NEGATE]: FORWARD,
};

const getOperatorTypes = flow(
  oddIndexElements,
  map(first),
  map('type'),
);

const createBilinearTag = (type, lhs, rhs) => (
  (isEmpty(lhs) || isEmpty(rhs))
    ? null
    : { type: NODE_OPERATOR_BILINEAR, value: { type, lhs, rhs } }
);

const createUnaryTag = (type, argument) => ({
  type: NODE_OPERATOR_UNARY,
  value: { type, argument },
});

const compactMiscGroup = node => {
  if (node.type !== NODE_MISC_GROUP || node.value.length > 1) {
    return node;
  } else if (node.value.length === 1) {
    return node.value[0];
  }
  return null;
};

const createTag = (operatorType, lhs, rhs) => {
  const arity = operatorArity[operatorType];
  const type = operatorTypes[operatorType];

  if (arity !== NODE_OPERATOR_UNARY) return createBilinearTag(type, lhs, rhs);

  const bindingDirection = unaryBindingDirections[operatorType];
  let leftSide = !isEmpty(lhs) ? lhs : null;
  let rightSide = !isEmpty(rhs) ? rhs : null;
  let argument;

  if (bindingDirection === FORWARD && rightSide && rightSide.type === NODE_MISC_GROUP) {
    argument = first(rightSide.value);
    rightSide = compactMiscGroup({ type: NODE_MISC_GROUP, value: rightSide.value.slice(1) });
  } else if (bindingDirection === FORWARD) {
    argument = rightSide;
    rightSide = null;
  } else if (leftSide && leftSide.type === NODE_MISC_GROUP) {
    argument = last(leftSide.value);
    leftSide = compactMiscGroup({ type: NODE_MISC_GROUP, value: leftSide.value.slice(1) });
  } else {
    argument = leftSide;
    leftSide = null;
  }

  const tag = createUnaryTag(type, argument);
  const group = compact([leftSide, tag, rightSide]);

  return compactMiscGroup({ type: NODE_MISC_GROUP, value: group });
};

export default (operators: TokenType[], direction: Direction): Transformer => ({
  pattern: new Pattern([
    new CaptureOptions(operators).negate().lazy().any(),
    new Pattern([
      new CaptureOptions(operators),
      new CaptureOptions(operators).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    /*
    FIXME: Don't ignore lhs on unary. I think it's inevitable that we'll just have to pass in at
    arbitrary transform function for this.
    */

    const operatorTypes = getOperatorTypes(captureGroups);

    if (direction === BACKWARD) {
      const initialSegment = last(segments);
      const remainingSegments = dropRight(1, segments);

      return reduceRight(propagateNull((lhs, [operator, rhs]) => (
        createTag(operator, rhs, lhs)
      )), initialSegment, zip(operatorTypes, remainingSegments));
    }


    const [initialSegment, ...remainingSegments] = segments;

    return reduce(propagateNull((lhs, [operator, rhs]) => (
      createTag(operator, lhs, rhs)
    )), initialSegment, zip(operatorTypes, remainingSegments));
  }),
});
