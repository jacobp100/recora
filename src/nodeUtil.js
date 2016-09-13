// @flow
import { NODE_MISC_GROUP } from './modules/math/types';
import type { Node, MiscGroupNode } from './modules/math/types'; // eslint-disable-line
import type { TokenNode } from './modules/transformer/types';

/* eslint-disable import/prefer-default-export */
export const compactMiscGroup = (node: TokenNode): ?Node => {
  if (node.type !== NODE_MISC_GROUP || !node.value) return node;

  const value: MiscGroupNode[] = node.value;
  if (value.length > 1) {
    return node;
  } else if (value.length === 1) {
    return value[0];
  }
  return null;
};
