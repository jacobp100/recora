// @flow
import { set, get, map } from 'lodash/fp';
import { FUNCTION_ADD } from './functions';
import { NODE_FUNCTION, NODE_ENTITY } from './tokenNodeTypes';
import type { TokenNode } from './tokenNodeTypes'; // eslint-disable-line
import { add as addEntityToEntity } from './math/entity';
import { mapUnlessNull } from './util';

const math = {
  functionTrie: {},
  context: {},
  setContext(context) {
    return set('context', context, this);
  },
  extendFunction(functionName, types, fn) {
    return set(['functionTrie', functionName, ...types, '_fn'], fn, this);
  },
  executeFunction(fn) {
    const { name, args } = fn;
    const triePath = map('type', args);
    const func = get(['functionTrie', name, ...triePath, '_fn'], this);
    if (!func) return null;

    const resolvedArgs = mapUnlessNull(arg => this.resolve(arg), args);
    if (!resolvedArgs) return null;

    return func(this.context, ...resolvedArgs);
  },
  resolve(value: TokenNode): ?TokenNode {
    switch (value.type) {
      case NODE_FUNCTION:
        return this.executeFunction(value.value);
      case NODE_ENTITY:
        return value.value;
      default:
        return null;
    }
  },
};

export default math
  .extendFunction(FUNCTION_ADD, [NODE_ENTITY, NODE_ENTITY], addEntityToEntity);
