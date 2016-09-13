// @flow
import type { TokenNode, Transformer, TransformResult } from './types';
import { mapUnlessNull } from '../../util';

/*
# Transformers

A transformer has the properties pattern and transform.

The pattern can be a PatternMatcher instance or anything that generates capture groups.

The transform property is a function that takes the capture groups matched, and a recurse function
to recursively parse a set of the capture groups; and returns a transformed capture group. TL;DR,

```js
const transform = (captureGroups, recurse) => recurse([
  captureGroups[0],
  captureGroups[2],
], ([transformedLhs, transformedRhs]) => {
  // transformed{Lhs,Rhs} are not null
  return createFunction(operator, transformedLhs, transformedRhs);
});
```

If you return an array from the transform function, it will continue trying to apply transform
rules. If you return an object, it will make that the return value and stop transforming. If you
return null, it will return null and stop transforming.

The recurse function takes an array of array of tokens (aka, capture groups), and a callback that
is invoked with the transformed capture groups. If one of the things you tried to transform
recursively returns null, the callback is not invoked: you can be certain that the capture groups
the callback was invoked with are actual results.

Say for example, you match a some tokens, an operator (like +), and then some more tokens. You'd
need the left and right hand sides to be transformed to create the function, so you call the
recurse function on these.

# Algorithm

We take an array of transformers and input tokens. We start from the first transformer, and if we
create a match, we do the transform, and attempt to match the same case. Only when we do not match
a case do we continue on to the next.
*/
export default (transforms: Transformer[]) => {
  const iter = (tokens: TransformResult, location = 0): ?TransformResult => {
    if (!Array.isArray(tokens)) return tokens;

    const transform = transforms[location];
    const captureGroups = transform.pattern.match(tokens);

    if (captureGroups) {
      const transformResult = transform.transform(captureGroups, (captureGroupsToTransform, cb) => {
        const transformedCaptureGroups = mapUnlessNull(captureGroupToTransform => (
          iter(captureGroupToTransform, location)
        ), captureGroupsToTransform);

        return transformedCaptureGroups
          ? cb(transformedCaptureGroups)
          : null;
      });

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
