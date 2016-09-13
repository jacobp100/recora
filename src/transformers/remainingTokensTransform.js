// @flow
import { castArray, keys } from 'lodash/fp';
import Color from 'color-forge';
import { Pattern, CaptureOptions } from '../modules/patternMatcher';
import type { Transformer, TransformResult } from '../modules/createTransformer';
import { TOKEN_COLOR, NODE_COLOR, TOKEN_DATETIME, NODE_DATETIME } from '../tokenNodeTypes';
import type { TokenNode, ColorNode, DateTimeNode } from '../tokenNodeTypes'; // eslint-disable-line
import { evenIndexElements, oddIndexElements } from '../util';

const transforms = {
  [TOKEN_COLOR]: (token: TokenNode): ColorNode => {
    const { values, alpha, space } = Color.hex(token.value);
    return { type: NODE_COLOR, values, alpha, space };
  },
  [TOKEN_DATETIME]: (token: TokenNode): DateTimeNode => ({
    type: NODE_DATETIME,
    value: token.value,
  }),
};
const transformTokens = keys(transforms);

const colorTransform: Transformer = {
  pattern: new Pattern([
    new CaptureOptions(transformTokens).negate().lazy().any(),
    new Pattern([
      new CaptureOptions(transformTokens),
      new CaptureOptions(transformTokens).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const unitSegments = oddIndexElements(captureGroups);

    let zippedSegments: TransformResult[] = castArray(segments[0]);
    for (let i = 0; i < unitSegments.length; i += 1) {
      const token = unitSegments[i][0];
      const colorFrom = transforms[token.type](token);
      if (colorFrom === null) return null;
      zippedSegments = zippedSegments.concat(colorFrom, segments[i + 1]);
    }

    return zippedSegments.length > 1 ? zippedSegments : zippedSegments[0];
  }),
};
export default colorTransform;
