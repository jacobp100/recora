// @flow
import { castArray, keys } from 'lodash/fp';
import Color from 'color-forge';
import { Pattern, CaptureOptions } from '../modules/patternMatcher';
import type { Transformer } from '../modules/createTransformer';
import { NODE_COLOR, NODE_DATETIME } from '../modules/math/types';
import type { ColorNode, DateTimeNode, DateTime } from '../modules/math/types'; // eslint-disable-line
import type { Token, TokenNode } from '../modules/types';
import { TOKEN_COLOR, TOKEN_DATETIME } from '../tokenTypes';
import { evenIndexElements, oddIndexElements } from '../util';

const transforms = {
  [TOKEN_COLOR]: (token: Token): ColorNode => {
    const { values, alpha, space } = Color.hex(token.value);
    return { type: NODE_COLOR, values, alpha, space };
  },
  [TOKEN_DATETIME]: (token: Token): ?DateTimeNode => {
    const value: ?DateTime = token.value;
    if (!value) return null;
    return { type: NODE_DATETIME, value };
  },
};
const transformTokens = keys(transforms);

const remainingTokensTransform: Transformer = {
  pattern: new Pattern([
    new CaptureOptions(transformTokens).negate().lazy().any(),
    new Pattern([
      new CaptureOptions(transformTokens),
      new CaptureOptions(transformTokens).negate().lazy().any(),
    ]).oneOrMore(),
  ]),
  transform: (captureGroups, transform) => transform(evenIndexElements(captureGroups), segments => {
    const remainingTokenSegments = oddIndexElements(captureGroups);

    let zippedSegments: TokenNode[] = castArray(segments[0]);
    for (let i = 0; i < remainingTokenSegments.length; i += 1) {
      const token: Token = remainingTokenSegments[i][0];
      const node = transforms[token.type](token);
      if (node === null) return null;
      zippedSegments = zippedSegments.concat(node, segments[i + 1]);
    }

    return zippedSegments.length > 1 ? zippedSegments : zippedSegments[0];
  }),
};
export default remainingTokensTransform;
