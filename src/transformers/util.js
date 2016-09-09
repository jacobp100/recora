// @flow
import { first, last, reduce, map, reduceRight, update, multiply, get } from 'lodash/fp';
import { TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX, TOKEN_UNIT_SUFFIX } from '../tokenNodeTypes';
import type { EntityNode } from '../tokenNodeTypes'; // eslint-disable-line
import { propagateNull } from '../util';

export const INTERMEDIATE_UNIT = 'INTERMEDIATE_UNIT';

export const combineUnitNamesPrefixesSuffixes = (segment: EntityNode[]): ?(EntityNode[]) => {
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

  return segmentWithIntermediateUnits;
};
