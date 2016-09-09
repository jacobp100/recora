// @flow
import {
  first, last, reduce, map, reduceRight, update, multiply, concat, set, isEqual, castArray, get,
} from 'lodash/fp';
import { combineUnits } from '../types/entity';
import { Pattern, CaptureOptions } from '../modules/patternMatcher';
import type { Transformer, TransformResult } from '../modules/createTransformer';
import type { Units } from '../data/units';
import {
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  NODE_MISC_GROUP,
  NODE_ENTITY,
} from '../tokenNodeTypes';
import { propagateNull, evenIndexElements, oddIndexElements } from '../util';


const getEntities = segment => {
  const INTERMEDIATE_UNIT = 'INTERMEDIATE_UNIT';

  let segmentWithIntermediateUnits = map(tag => (
    tag.type === TOKEN_UNIT_NAME
      ? ({ type: INTERMEDIATE_UNIT, name: tag.value, power: 1 })
      : tag
  ), segment);

  // Combine unit suffixes with intermediate unit powers
  segmentWithIntermediateUnits = reduce(propagateNull((accum, tag) => {
    if (tag.type !== TOKEN_UNIT_SUFFIX) {
      return [...accum, tag];
    } else if (get('type', last(accum)) === INTERMEDIATE_UNIT) {
      return update([accum.length - 1, 'power'], multiply(tag.value), accum);
    }
    return null;
  }), [], segmentWithIntermediateUnits);

  // Combine unit prefixes with intermediate unit powers
  segmentWithIntermediateUnits = reduceRight(propagateNull((accum, tag) => {
    if (tag.type !== TOKEN_UNIT_PREFIX) {
      return [tag, ...accum];
    } else if (get('type', first(accum)) === INTERMEDIATE_UNIT) {
      return update([0, 'power'], multiply(tag.value), accum);
    }
    return null;
  }), [], segmentWithIntermediateUnits);

  if (segmentWithIntermediateUnits === null) return null;

  /*
  Combine all units and numbers into entities. Examples of algorithm below:
  number unit1
    => [Entity(number unit1)]
  unit1 number
    => [Entity(number unit1)]
  number unit1 unit2
    => [Entity(number unit1 unit2)]
  number1 unit1 number1 unit2
    => [Entity(number1 unit1), Entity(number2 unit2)]
  unit1 number1 unit2 number2 unit3
    => [Entity(number1 unit1 unit2), Entity(number2 unit3)]
  */
  const baseEntityValue = { quantity: undefined, units: {} };
  const entityValues = reduce((accum, tag) => {
    if (tag.type === INTERMEDIATE_UNIT) {
      const unit: Units = { [tag.name]: tag.power };
      return update([accum.length - 1, 'units'], combineUnits(unit), accum);
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

const entityTransform: Transformer = {
  pattern: new Pattern([
    new CaptureOptions(unitParts).negate().lazy().any(),
    new Pattern([
      new CaptureOptions(unitParts).lazy().oneOrMore(),
      new CaptureOptions(unitParts).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const unitSegments = oddIndexElements(captureGroups);

    let zippedSegments: TransformResult[] = castArray(segments[0]);
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
export default entityTransform;
