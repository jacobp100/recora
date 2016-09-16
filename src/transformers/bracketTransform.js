// @flow
import { first, last } from 'lodash/fp';
import {
  Pattern, CaptureWildcard, CaptureElement, CaptureOptions,
} from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import { TOKEN_FUNCTION, TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE } from '../tokenTypes';
import { NODE_BRACKETS, NODE_ARRAY_GROUP, NODE_FUNCTION } from '../modules/math/types';
import { uncastArray } from '../util';

const bracketTransform: Transformer = {
  pattern: new Pattern([
    new CaptureWildcard().any(),
    new CaptureElement(TOKEN_FUNCTION).zeroOrOne(),
    new CaptureElement(TOKEN_BRACKET_OPEN),
    new CaptureOptions([TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE]).negate().lazy().any(),
    new CaptureElement(TOKEN_BRACKET_CLOSE),
    new CaptureWildcard().any().lazy(),
  ]),
  transform: (captureGroups, transform) => transform([captureGroups[3]], ([bracketGroup]) => {
    const fn = first(captureGroups[1]);

    let value;
    if (!fn) {
      value = { type: NODE_BRACKETS, value: bracketGroup };
    } else if (bracketGroup.type === NODE_ARRAY_GROUP) {
      value = { type: NODE_FUNCTION, name: fn.value, args: bracketGroup.value };
    } else {
      value = { type: NODE_FUNCTION, name: fn.value, args: [bracketGroup] };
    }

    const concatSegments = [].concat(
      first(captureGroups),
      value,
      last(captureGroups)
    );
    return uncastArray(concatSegments);
  }),
};
export default bracketTransform;
