// @flow
import { last, reduce, update, concat, set, some, castArray, reject } from 'lodash/fp';
import { combineUnits } from '../types/entity';
import { Pattern, CaptureOptions } from '../modules/patternMatcher';
import type { Transformer, TransformResult } from '../modules/createTransformer';
import type { Units } from '../data/units';
import {
  TOKEN_NOOP,
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  NODE_MISC_GROUP,
  NODE_ENTITY,
} from '../tokenNodeTypes';
import type { EntityNode } from '../tokenNodeTypes'; // eslint-disable-line
import { INTERMEDIATE_UNIT, combineUnitNamesPrefixesSuffixes } from './util';
import { evenIndexElements, oddIndexElements } from '../util';
import { compactMiscGroup } from '../nodeUtil';


const getEntities = segment => {
  const segmentWithIntermediateUnits = combineUnitNamesPrefixesSuffixes(segment);
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
  const baseEntityValue = { type: NODE_ENTITY, quantity: undefined, units: {} };
  const maybeEntities = reduce((accum, tag) => {
    if (tag.type === INTERMEDIATE_UNIT) {
      const unit: Units = { [tag.name]: tag.power };
      return update([accum.length - 1, 'units'], combineUnits(unit), accum);
    } else if (tag.type === TOKEN_NUMBER && last(accum).quantity === undefined) {
      return set([accum.length - 1, 'quantity'], tag.value, accum);
    } else if (tag.type === TOKEN_NUMBER) {
      const newEntityValue = set('quantity', tag.value, baseEntityValue);
      return concat(accum, newEntityValue);
    }
    return accum;
  }, [baseEntityValue], segmentWithIntermediateUnits);

  if (some(entity => entity.quantity === undefined, maybeEntities)) return null;

  const entities: EntityNode = maybeEntities;
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

    zippedSegments = reject({ type: TOKEN_NOOP }, zippedSegments);

    return compactMiscGroup({ type: NODE_MISC_GROUP, value: zippedSegments });
  }),
};
export default entityTransform;
