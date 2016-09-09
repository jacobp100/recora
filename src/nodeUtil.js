// @flow
import { NODE_MISC_GROUP } from './tokenNodeTypes';
import type { TokenNode, NodeMiscGroup } from './tokenNodeTypes'; // eslint-disable-line

/* eslint-disable import/prefer-default-export */
export const compactMiscGroup = (node: NodeMiscGroup): ?TokenNode => {
  if (node.type !== NODE_MISC_GROUP || !node.value) return node;

  const value: NodeMiscGroup[] = node.value;
  if (value.length > 1) {
    return node;
  } else if (value.length === 1) {
    return value[0];
  }
  return null;
};
