// @flow
import {
  __, flow, take, takeRight, takeWhile, takeRightWhile, drop, dropRight, dropWhile, dropRightWhile,
  isEmpty, map, includes, last, filter,
} from 'lodash/fp';
import type { Transformer } from '../modules/createTransformer';
import {
  TOKEN_NOOP, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX, TOKEN_UNIT_SUFFIX, TOKEN_NUMBER,
} from '../tokenTypes';
import { NODE_CONVERSION } from '../modules/math/types';
import { INTERMEDIATE_UNIT, combineUnitNamesPrefixesSuffixes } from './util';

const conversionTokens = [
  TOKEN_NOOP,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
];
const isNoop = type => type === TOKEN_NOOP;
const notNoop = type => type !== TOKEN_NOOP;
const isConversionToken = includes(__, conversionTokens);

const findLeftConversion = tags => {
  const tagTypes = map('type', tags);

  const conversionTagTypes = flow(
    takeWhile(isConversionToken),
    dropRightWhile(notNoop),
    dropWhile(isNoop)
  )(tagTypes);

  if (isEmpty(conversionTagTypes) || last(conversionTagTypes) !== TOKEN_NOOP) return null;

  const index = conversionTagTypes.length;
  const conversionTags = take(index, tags);
  const remainingTags = drop(index, tags);
  return [remainingTags, conversionTags];
};

const findRightConversion = tags => {
  const tagTypes = map('type', tags);

  let conversionTagTypes = takeRightWhile(isConversionToken, tagTypes);

  const precedingTag = tags[tags.length - conversionTagTypes.length - 1];

  if (precedingTag && (precedingTag.type === TOKEN_NUMBER || precedingTag.type === 'DATE_TIME')) {
    // Gathered too many tags and went into tags that would form an entity, drop some tags
    conversionTagTypes = dropWhile(notNoop, conversionTagTypes);
  }

  if (isEmpty(conversionTagTypes)) return null;

  const index = conversionTagTypes.length;
  const conversionTags = takeRight(index, tags);
  const remainingTags = dropRight(index, tags);
  return [remainingTags, conversionTags];
};

const findConversion = tags => findLeftConversion(tags) || findRightConversion(tags);


const conversionsTransform: Transformer = {
  pattern: { match: findConversion },
  transform: (captureGroups, transform) => transform([captureGroups[0]], ([value]) => {
    const conversionSegment = captureGroups[1];
    const segmentWithIntermediateUnits = combineUnitNamesPrefixesSuffixes(conversionSegment);
    if (segmentWithIntermediateUnits === null) return null;

    const units = flow(
      filter({ type: INTERMEDIATE_UNIT }),
      map(unit => ({ [unit.name]: unit.power }))
    )(segmentWithIntermediateUnits);

    return { type: NODE_CONVERSION, value, units };
  }),
};
export default conversionsTransform;
