// @flow
import { first, last } from 'lodash/fp';
import { Pattern, CaptureElement, CaptureWildcard } from '../modules/patternMatcher';
import type { Transformer } from '../modules/transformer/types';
import { basePercentage } from '../modules/math/types';
import type { PercentageNode } from '../modules/math/types'; // eslint-disable-line
import { TOKEN_NUMBER, TOKEN_PERCENTAGE } from '../tokenTypes';
import { uncastArray } from '../util';


const entityTransform: Transformer = {
  // TODO: Could be made more efficient
  pattern: new Pattern([
    new CaptureElement(TOKEN_NUMBER).negate().lazy().any(),
    new Pattern([
      new CaptureElement(TOKEN_NUMBER),
      new CaptureElement(TOKEN_PERCENTAGE),
      new CaptureWildcard().lazy().any(),
    ]),
  ]),
  transform: (captureGroups, transform) => transform([
    captureGroups[0],
    captureGroups[3],
  ], segments => {
    const value: number = captureGroups[1][0].value;
    const percentage: PercentageNode = { ...basePercentage, value };

    const concatSegments = [].concat(
      first(segments),
      percentage,
      last(segments)
    );
    return uncastArray(concatSegments);
  }),
};
export default entityTransform;
