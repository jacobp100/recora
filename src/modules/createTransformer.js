// @flow
import type { TokenNode } from '../tokenNodeTypes';
import { mapUnlessNull } from '../util';

export type TransformResult = TokenNode[] | TokenNode;
export type TransformFunction = (captureGroups: TransformResult[]) => ?TransformResult;
export type TransformTokenFunction =
  (captureGroupsToTransform: TransformResult[], transform: TransformFunction) => void;
export type CaptureGroupFunction = (tokens: TokenNode[]) => ?((TokenNode[])[]);
export type Transformer = {
  pattern: { match: CaptureGroupFunction },
  transform: (captureGroups: (TokenNode[])[], transform: TransformTokenFunction) => void,
};

export default (transforms: Transformer[]) => {
  const iter = (tokens: TransformResult, location = 0): ?TransformResult => {
    if (!Array.isArray(tokens)) return tokens;

    const transform = transforms[location];
    const captureGroups = transform.pattern.match(tokens);

    if (captureGroups) {
      let transformResult: ?TransformResult = null;

      const transformCb = (captureGroupsToTransform, cb) => {
        const transformedCaptureGroups = mapUnlessNull(captureGroupToTransform => (
          iter(captureGroupToTransform, location)
        ), captureGroupsToTransform);

        if (transformedCaptureGroups) {
          transformResult = cb(transformedCaptureGroups);
        }
      };

      transform.transform(captureGroups, transformCb);

      return transformResult
        ? iter(transformResult, location)
        : null;
    } else if (location < transforms.length - 1) {
      return iter(tokens, location + 1);
    }
    return tokens;
  };

  return (tokens: TokenNode[]): ?TokenNode => {
    const result = iter(tokens, 0);
    return !Array.isArray(result) ? result : null;
  };
};
