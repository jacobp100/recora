// @flow
import { values, map, without, isEmpty, reject } from 'lodash/fp';
import { CaptureWildcard } from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import * as nodes from '../modules/math/types';
import { TOKEN_NOOP } from '../tokenTypes';
import { compactMiscGroup } from './util';

const nodeTypes = values(nodes);

const allowedTypes = [...nodeTypes, TOKEN_NOOP];

const bracketTransform: Transformer = {
  pattern: new CaptureWildcard().oneOrMore().lazy(),
  transform: captureGroups => {
    const captureGroup = captureGroups[0];
    const captureGroupTypes = map('type', captureGroup);
    const extraneousTypes = without(allowedTypes, captureGroupTypes);

    if (!isEmpty(extraneousTypes)) return null;

    const value = reject({ type: TOKEN_NOOP }, captureGroup);

    // compactMiscGroup will return null for empty values, but that will make the transformer
    // incorrectly fail
    if (isEmpty(value)) return [];

    const miscGroup = { type: nodes.NODE_MISC_GROUP, value };
    return compactMiscGroup(miscGroup);
  },
};
export default bracketTransform;
