// @flow
import type { TokenNode } from './types';
import { mapUnlessNull } from '../util';

export type TransformResult = TokenNode[] | TokenNode;
export type CaptureGroup = TokenNode[];
export type TransformFunction = (captureGroups: CaptureGroup[]) => ?TransformResult;
export type TransformTokenFunction =
  (captureGroupsToTransform: CaptureGroup[], transform: TransformFunction) => void;
export type CaptureGroupFunction = (tokens: TokenNode[]) => ?(CaptureGroup[]);
export type Transformer = {
  pattern: { match: CaptureGroupFunction },
  transform: (captureGroups: CaptureGroup[], transform: TransformTokenFunction) => void,
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
