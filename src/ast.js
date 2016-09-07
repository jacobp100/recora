// @flow
/* eslint-disable no-unused-vars */
import { first, last, reduce, zip, flow, map, propertyOf, some, isEmpty } from 'lodash/fp';
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE,
  TOKEN_COLOR,
  TOKEN_NOOP,
  TOKEN_VECTOR_START,
  TOKEN_VECTOR_SEPARATOR,
  TOKEN_VECTOR_END,
  TAG_BRACKETS,
  TAG_OPERATOR_UNARY,
  TAG_OPERATOR_BILINEAR,
} from './types';
/* eslint-enable */
import type { Token } from './types'; // eslint-disable-line
import { Pattern, Wildcard, Element, ElementOptions } from './patternMatcher';

type TransformFunction = (tokens: Token[]) => Token[]
type TransformTokenFunction =
  (captureGroupsToTransform: Token[], transform: TransformFunction) => Token[];
type Transformer = {
  pattern: Pattern | Wildcard | Element | ElementOptions,
  transform: (captureGroups: Token, transform: TransformTokenFunction) => Token[]
};

const createTransformer = (transforms: Transformer[]) => {
  const iter = (tokens: Token[], location = 0): Token[] => {
    const transform = transforms[location];
    const captureGroups = transform.pattern.match(tokens);

    if (captureGroups) {
      let nextTokens = null;

      const transformCb = (captureGroupsToTransform, cb) => {
        const transformedCaptureGroups = [];

        for (const captureGroupToTransform of captureGroupsToTransform) {
          const transformedCaptureGroup = iter(captureGroupToTransform, location);
          if (transformedCaptureGroup === null) return;
          transformedCaptureGroups.push(transformedCaptureGroup);
        }

        nextTokens = cb(transformedCaptureGroups);
      };

      transform.transform(captureGroups, transformCb);

      return nextTokens
        ? iter(nextTokens, location)
        : null;
    } else if (location < transforms.length - 1) {
      return iter(tokens, location + 1);
    }
    return tokens;
  };

  return tokens => iter(tokens, 0);
};

const bracketTransform = {
  pattern: new Pattern([
    new Wildcard().any(),
    new Element(TOKEN_BRACKET_OPEN),
    new ElementOptions([TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE]).negate().lazy().any(),
    new Element(TOKEN_BRACKET_CLOSE),
    new Wildcard().any().lazy(),
  ]),
  transform: (captureGroups, transform) => transform([captureGroups[2]], ([bracketGroup]) => (
    [...first(captureGroups), { type: TAG_BRACKETS, value: bracketGroup }, ...last(captureGroups)]
  )),
};

const everyOtherFrom = from => array => {
  const out = [];
  for (let i = from; i < array.length; i += 2) {
    out.push(array[i]);
  }
  return out;
};
const evenNumbers = everyOtherFrom(0);
const oddNumbers = everyOtherFrom(1);

const bileanerOperationTypes = {
  [TOKEN_OPERATOR_NEGATE]: {
    tagType: TAG_OPERATOR_UNARY,
    operatorType: 'negate',
  },
  [TOKEN_OPERATOR_MULTIPLY]: {
    tagType: TAG_OPERATOR_BILINEAR,
    operatorType: 'multiply',
  },
  [TOKEN_OPERATOR_DIVIDE]: {
    tagType: TAG_OPERATOR_BILINEAR,
    operatorType: 'multiply',
  },
};

const getOperatorTypes = flow(
  oddNumbers,
  map(first),
  map('type'),
  map(propertyOf(bileanerOperationTypes)),
);

const createOperatorTransform = operators => ({
  pattern: new Pattern([
    new ElementOptions(operators).negate().lazy().any(),
    new Pattern([
      new ElementOptions(operators),
      new ElementOptions(operators).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenNumbers(captureGroups), segments => {
    /*
    FIXME:
      * Add direction support
      * Don't ignore lhs on unary
        * I think it's inevitable that we'll just have to pass in at arbitrary transform function
          for this
    */

    // if (some(isEmpty, segments)) return null;

    const operatorTypes = getOperatorTypes(captureGroups);
    const [firstSegment, ...remainingSegments] = segments;

    return reduce((lhs, [{ tagType, operatorType }, rhs]) => ({
      type: tagType,
      value: tagType === TAG_OPERATOR_UNARY
        ? { type: operatorType, value: rhs }
        : { type: operatorType, lhs, rhs },
    }), firstSegment, zip(operatorTypes, remainingSegments));
  }),
});

const transformTokens = createTransformer([
  bracketTransform,
  createOperatorTransform([TOKEN_OPERATOR_MULTIPLY, TOKEN_OPERATOR_DIVIDE]),
  createOperatorTransform([TOKEN_OPERATOR_NEGATE]),
]);

console.log(
  JSON.stringify(
    transformTokens([
      { type: TOKEN_NUMBER },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_NUMBER },
      { type: TOKEN_OPERATOR_MULTIPLY },
      { type: TOKEN_OPERATOR_NEGATE },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
      { type: TOKEN_UNIT_NAME },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_BRACKET_CLOSE },
      { type: TOKEN_COLOR },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
    ])
  )
);

// const transform = [
//   new Pattern([
//     new Element(TOKEN_OPERATOR).negate().any(),
//     new Pattern([
//       new Element(TOKEN_OPERATOR),
//       new Element(TOKEN_OPERATOR).negate().any(),
//     ]).oneOrMore(),
//   ]),
// ];
