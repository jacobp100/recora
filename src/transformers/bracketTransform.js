// @flow
import { first, last } from 'lodash/fp';
import {
  Pattern, CaptureWildcard, CaptureElement, CaptureOptions,
} from '../modules/patternMatcher';
import type { Transformer } from '../modules/createTransformer';
import { TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE } from '../tokenTypes';
import { NODE_BRACKETS } from '../modules/math/types';
import { uncastArray } from '../util';

const bracketTransform: Transformer = {
  pattern: new Pattern([
    new CaptureWildcard().any(),
    new CaptureElement(TOKEN_BRACKET_OPEN),
    new CaptureOptions([TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE]).negate().lazy().any(),
    new CaptureElement(TOKEN_BRACKET_CLOSE),
    new CaptureWildcard().any().lazy(),
  ]),
  transform: (captureGroups, transform) => transform([captureGroups[2]], ([bracketGroup]) => {
    const zippedSegments = [].concat(
      first(captureGroups),
      { type: NODE_BRACKETS, value: bracketGroup },
      last(captureGroups)
    );
    return uncastArray(zippedSegments);
  }),
};
export default bracketTransform;
