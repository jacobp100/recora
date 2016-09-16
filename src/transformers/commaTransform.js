// @flow
import { Pattern, CaptureElement } from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import { NODE_ARRAY_GROUP } from '../modules/math/types';
import type { PercentageNode } from '../modules/math/types'; // eslint-disable-line
import { TOKEN_COMMA } from '../tokenTypes';
import { evenIndexElements } from '../util';


const entityTransform: Transformer = {
  // TODO: Could be made more efficient
  pattern: new Pattern([
    new CaptureElement(TOKEN_COMMA).negate().lazy().any(),
    new Pattern([
      new CaptureElement(TOKEN_COMMA),
      new CaptureElement(TOKEN_COMMA).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => (
    { type: NODE_ARRAY_GROUP, value: segments }
  )),
};
export default entityTransform;
