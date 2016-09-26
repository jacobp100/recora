// @flow
import { first, last, reduce, map, reduceRight, update, multiply, get } from 'lodash/fp';
import { NODE_MISC_GROUP } from '../modules/math/types';
import type { EntityNode, Node, MiscGroupNode } from '../modules/math/types'; // eslint-disable-line
import type { TokenNode } from '../modules/transformer/types';
import { TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX, TOKEN_UNIT_SUFFIX } from '../tokenTypes';
import { propagateNull } from '../util';

export const INTERMEDIATE_UNIT = 'INTERMEDIATE_UNIT';

export const combineUnitNamesPrefixesSuffixes = (segment: TokenNode[]): ?(EntityNode[]) => {
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

export const compactMiscGroup = (node: TokenNode): ?Node => {
  if (node.type !== NODE_MISC_GROUP || !node.value) return node;

  const value: MiscGroupNode[] = node.value;
  if (value.length > 1) {
    return node;
  } else if (value.length === 1) {
    return value[0];
  }
  return null;
};
