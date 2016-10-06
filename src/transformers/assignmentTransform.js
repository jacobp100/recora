// @flow
import {
  Pattern, CaptureWildcard, CaptureElement,
} from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import { TOKEN_ASSIGNMENT } from '../tokenTypes';
import { baseAssignment } from '../modules/math/types';

const bracketTransform: Transformer = {
  pattern: new Pattern([
    new CaptureElement(TOKEN_ASSIGNMENT),
    new CaptureWildcard().any().lazy(),
  ]),
  transform: (captureGroups, transform) => transform([captureGroups[1]], ([value]) => ({
    ...baseAssignment, identifier: captureGroups[0][0].value, value,
  })),
};
export default bracketTransform;
