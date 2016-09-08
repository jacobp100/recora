// @flow
/* eslint-disable no-unused-vars */
import {
  first, last, reduce, zip, flow, map, propertyOf, some, isEmpty, dropRight, reduceRight, update,
  add, concat, set, flatten, isEqual, compact,
} from 'lodash/fp';
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
  NODE_BRACKETS,
  NODE_OPERATOR_UNARY,
  NODE_OPERATOR_BILINEAR,
  NODE_ENTITY,
  NODE_MISC_GROUP,
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
    [...first(captureGroups), { type: NODE_BRACKETS, value: bracketGroup }, ...last(captureGroups)]
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

const NO_DIRECTION = 0;
const FORWARD = 0;
const BACKWARD = 1;

const bileanerOperationTypes = {
  [TOKEN_OPERATOR_NEGATE]: {
    tagType: NODE_OPERATOR_UNARY,
    bindingDirection: FORWARD,
    operatorType: 'negate',
  },
  [TOKEN_OPERATOR_EXPONENT]: {
    tagType: NODE_OPERATOR_BILINEAR,
    bindingDirection: NO_DIRECTION,
    operatorType: 'exponent',
  },
  [TOKEN_OPERATOR_MULTIPLY]: {
    tagType: NODE_OPERATOR_BILINEAR,
    bindingDirection: NO_DIRECTION,
    operatorType: 'multiply',
  },
  [TOKEN_OPERATOR_DIVIDE]: {
    tagType: NODE_OPERATOR_BILINEAR,
    bindingDirection: NO_DIRECTION,
    operatorType: 'multiply',
  },
};

const getOperatorTypes = flow(
  oddNumbers,
  map(first),
  map('type'),
  map(propertyOf(bileanerOperationTypes)),
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

const createTag = ({ tagType, bindingDirection, operatorType }, lhs, rhs) => {
  if (tagType !== NODE_OPERATOR_UNARY) return createBilinearTag(operatorType, lhs, rhs);

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

  const tag = createUnaryTag(operatorType, argument);
  const group = compact([leftSide, tag, rightSide]);

  return compactMiscGroup({ type: NODE_MISC_GROUP, value: group });
};

const propagateNull = cb => (accum, value) => ((accum === null) ? null : cb(accum, value));

const createOperatorTransform = (operators, direction) => ({
  pattern: new Pattern([
    new ElementOptions(operators).negate().lazy().any(),
    new Pattern([
      new ElementOptions(operators),
      new ElementOptions(operators).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenNumbers(captureGroups), segments => {
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

const getEntities = segment => {
  const INTERMEDIATE_UNIT = 'INTERMEDIATE_UNIT';

  let segmentWithIntermediateUnits = map(tag => (
    tag.type === TOKEN_UNIT_NAME
      ? ({ type: INTERMEDIATE_UNIT, name: tag.value, power: 1 })
      : tag
  ), segment);

  segmentWithIntermediateUnits = reduce(propagateNull((accum, tag) => {
    if (tag.type !== TOKEN_UNIT_SUFFIX) {
      return [...accum, tag];
    } else if (last(accum.type) === INTERMEDIATE_UNIT) {
      return update([accum.length - 1, 'power'], add(tag.power), accum);
    }
    return null;
  }), [], segmentWithIntermediateUnits);

  segmentWithIntermediateUnits = reduceRight(propagateNull((accum, tag) => {
    if (tag.type !== TOKEN_UNIT_SUFFIX) {
      return [tag, ...accum];
    } else if (first(accum.type) === INTERMEDIATE_UNIT) {
      return update([0, 'power'], add(tag.power), accum);
    }
    return null;
  }), [], segmentWithIntermediateUnits);

  if (segmentWithIntermediateUnits === null) return null;

  const baseEntityValue = { quantity: undefined, units: [] };
  const entityValues = reduce((accum, tag) => {
    if (tag.type === INTERMEDIATE_UNIT) {
      const unit = { name: tag.name, power: tag.power };
      return update([accum.length - 1, 'units'], concat([unit]), accum);
    } else if (tag.type === TOKEN_NUMBER && last(accum).quantity === undefined) {
      return set([accum.length - 1, 'quantity'], tag.value, accum);
    } else if (tag.type === TOKEN_NUMBER) {
      const newEntityValue = set(['value', 'quantity'], tag.value, baseEntityValue);
      return concat(accum, newEntityValue);
    }
    return accum;
  }, [baseEntityValue], segmentWithIntermediateUnits);

  if (entityValues.length === 1 && isEqual(last(entityValues), baseEntityValue)) return [];

  const entities = map(value => ({ type: NODE_ENTITY, value }), entityValues);

  return entities;
};

const unitParts = [TOKEN_NUMBER, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX, TOKEN_UNIT_SUFFIX];
const unitsTransform = {
  pattern: new Pattern([
    new ElementOptions(unitParts).negate().lazy().any(),
    new Pattern([
      new ElementOptions(unitParts).lazy().oneOrMore(),
      new ElementOptions(unitParts).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenNumbers(captureGroups), segments => {
    const unitSegments = oddNumbers(captureGroups);

    let zippedSegments = segments[0];
    for (let i = 0; i < unitSegments.length; i += 1) {
      const entitiesOfSegment = getEntities(unitSegments[i]);
      if (entitiesOfSegment === null) return null;
      zippedSegments = zippedSegments.concat(entitiesOfSegment, segments[i + 1]);
    }

    if (zippedSegments.length === 0) {
      return null;
    } else if (zippedSegments.length === 1) {
      return first(zippedSegments);
    }
    return { type: NODE_MISC_GROUP, value: zippedSegments };
  }),
};

const transformTokens = createTransformer([
  bracketTransform,
  createOperatorTransform([TOKEN_OPERATOR_ADD, TOKEN_OPERATOR_SUBTRACT], FORWARD),
  createOperatorTransform([TOKEN_OPERATOR_MULTIPLY, TOKEN_OPERATOR_DIVIDE], FORWARD),
  createOperatorTransform([TOKEN_OPERATOR_EXPONENT, TOKEN_OPERATOR_NEGATE], BACKWARD),
  unitsTransform,
]);

console.log(
  JSON.stringify(
    transformTokens([
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_BRACKET_OPEN },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_BRACKET_OPEN },
      // { type: TOKEN_NUMBER, value: 2 },
      // { type: TOKEN_OPERATOR_EXPONENT },
      { type: TOKEN_NUMBER, value: 3 },
      { type: TOKEN_OPERATOR_NEGATE },
      { type: TOKEN_NUMBER, value: 3 },
      { type: TOKEN_NUMBER, value: 3 },
      // { type: TOKEN_OPERATOR_EXPONENT },
      // { type: TOKEN_NUMBER, value: 4 },
      // { type: TOKEN_OPERATOR_MULTIPLY },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_UNIT_NAME, value: 'meter' },
      // { type: TOKEN_BRACKET_CLOSE },
      // { type: TOKEN_UNIT_NAME },
      // { type: TOKEN_NUMBER, value: 10 },
      // { type: TOKEN_BRACKET_CLOSE },
      // { type: TOKEN_NUMBER, value: 10 },
    ])
  )
);
