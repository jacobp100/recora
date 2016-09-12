// @flow
import { castArray } from 'lodash/fp';
import { Pattern, CaptureElement } from '../modules/patternMatcher';
import type { Transformer, TransformResult } from '../modules/createTransformer';
import { TOKEN_DATETIME, NODE_DATETIME } from '../tokenNodeTypes';
import type { DateTime, DateTimeNode } from '../tokenNodeTypes'; // eslint-disable-line
import { evenIndexElements, oddIndexElements } from '../util';

const getDate = (value: DateTime): DateTimeNode => ({ type: NODE_DATETIME, value });

const dateTimeTransform: Transformer = {
  pattern: new Pattern([
    new CaptureElement(TOKEN_DATETIME).negate().lazy().any(),
    new Pattern([
      new CaptureElement(TOKEN_DATETIME),
      new CaptureElement(TOKEN_DATETIME).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const unitSegments = oddIndexElements(captureGroups);

    let zippedSegments: TransformResult[] = castArray(segments[0]);
    for (let i = 0; i < unitSegments.length; i += 1) {
      const date = getDate(unitSegments[i][0].value);
      if (date === null) return null;
      zippedSegments = zippedSegments.concat(date, segments[i + 1]);
    }

    return zippedSegments.length > 1 ? zippedSegments : zippedSegments[0];
  }),
};
export default dateTimeTransform;
