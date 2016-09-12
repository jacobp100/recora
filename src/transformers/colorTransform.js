// @flow
import { castArray } from 'lodash/fp';
import Color from 'color-forge';
import { Pattern, CaptureElement } from '../modules/patternMatcher';
import type { Transformer, TransformResult } from '../modules/createTransformer';
import { TOKEN_COLOR, NODE_COLOR } from '../tokenNodeTypes';
import type { ColorNode } from '../tokenNodeTypes'; // eslint-disable-line
import { evenIndexElements, oddIndexElements } from '../util';

const getHexColor = (text: string): ColorNode => {
  const { values, alpha, space } = Color.hex(text);
  return { type: NODE_COLOR, values, alpha, space };
};

const colorTransform: Transformer = {
  pattern: new Pattern([
    new CaptureElement(TOKEN_COLOR).negate().lazy().any(),
    new Pattern([
      new CaptureElement(TOKEN_COLOR),
      new CaptureElement(TOKEN_COLOR).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const unitSegments = oddIndexElements(captureGroups);

    let zippedSegments: TransformResult[] = castArray(segments[0]);
    for (let i = 0; i < unitSegments.length; i += 1) {
      const colorFrom = getHexColor(unitSegments[i][0].value);
      if (colorFrom === null) return null;
      zippedSegments = zippedSegments.concat(colorFrom, segments[i + 1]);
    }

    return zippedSegments.length > 1 ? zippedSegments : zippedSegments[0];
  }),
};
export default colorTransform;
