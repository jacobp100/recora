// @flow
import { first, isEmpty } from 'lodash/fp';
import {
  Pattern, CaptureWildcard, CaptureElement,
} from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import { TOKEN_FUNCTION } from '../tokenTypes';
import { baseFunction } from '../modules/math/types';
import { uncastArray } from '../util';

const bracketTransform: Transformer = {
  pattern: new Pattern([
    new CaptureWildcard().any(),
    new CaptureElement(TOKEN_FUNCTION),
    new CaptureWildcard().any().lazy(),
  ]),
  transform: (captureGroups, transform) => transform([captureGroups[2]], ([arg]) => {
    if (isEmpty(arg)) return null;

    const fn = first(captureGroups[1]);

    const concatSegments = [].concat(
      first(captureGroups),
      { ...baseFunction, name: fn.value, args: [arg] }
    );
    return uncastArray(concatSegments);
  }),
};
export default bracketTransform;
