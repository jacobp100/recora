// @flow
import type { Token } from '../types';
import { Pattern, CaptureWildcard, CaptureElement, CaptureOptions } from './patternMatcher';

export type TransformResult = Token[] | Token;
export type TransformFunction = (captureGroups: TransformResult[]) => ?TransformResult
export type TransformTokenFunction =
  (captureGroupsToTransform: TransformResult[], transform: TransformFunction) => void;
export type Transformer = {
  pattern: Pattern | CaptureWildcard | CaptureElement | CaptureOptions,
  transform: (captureGroups: Token, transform: TransformTokenFunction) => void
};

export default (transforms: Transformer[]) => {
  const iter = (tokens: TransformResult, location = 0): ?TransformResult => {
    const transform = transforms[location];
    const captureGroups = transform.pattern.match(tokens);

    if (captureGroups) {
      let transformResult: ?TransformResult = null;

      const transformCb = (captureGroupsToTransform, cb) => {
        const transformedCaptureGroups: TransformResult[] = [];

        for (const captureGroupToTransform of captureGroupsToTransform) {
          const transformedCaptureGroup = iter(captureGroupToTransform, location);
          if (!transformedCaptureGroup) return;
          transformedCaptureGroups.push(transformedCaptureGroup);
        }

        transformResult = cb(transformedCaptureGroups);
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

  return (tokens: Token[]) => iter(tokens, 0);
};
