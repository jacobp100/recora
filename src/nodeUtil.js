// @flow
import { NODE_MISC_GROUP } from './types';
import type { Token } from './types'; // eslint-disable-line

/* eslint-disable import/prefer-default-export */
export const compactMiscGroup = (node: Token): ?Token => {
  if (node.type !== NODE_MISC_GROUP || !node.value) return node;

  const value: Token[] = node.value;
  if (value.length > 1) {
    return node;
  } else if (value.length === 1) {
    return value[0];
  }
  return null;
};
