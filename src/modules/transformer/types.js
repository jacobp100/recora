// @flow
import type { Token } from '../tokenizer/types';
import type { Node } from '../math/types';

export type TokenNode = Token | Node;

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
