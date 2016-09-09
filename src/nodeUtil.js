import { NODE_MISC_GROUP } from './types';

/* eslint-disable import/prefer-default-export */
export const compactMiscGroup = node => {
  if (node.type !== NODE_MISC_GROUP || node.value.length > 1) {
    return node;
  } else if (node.value.length === 1) {
    return node.value[0];
  }
  return null;
};
