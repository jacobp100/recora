import { set, get, map } from 'lodash/fp';
import { FUNCTION_ADD } from './functions';
import { NODE_FUNCTION, NODE_ENTITY } from '../types';
import type { Token } from '../types'; // eslint-disable-line
import { addEntityToEntity } from './math/entity';

const math = {
  functionTrie: {},
  config: {},
  extendFunction(functionName, types, fn) {
    return set(['functionTrie', functionName, ...types, '_fn'], fn, this);
  },
  executeFunction(fn) {
    const { name, args } = fn;
    const triePath = map('type', args);
    const func = get(['functionTrie', name, ...triePath, '_fn'], this);
    if (!func) return null;

    const resolvedArgs = [];
    for (const arg of args) {
      const resolvedArg = this.resolve(arg);
      if (!resolvedArg) return null;
      resolvedArgs.push(arg);
    }

    return func(...args);
  },
  resolve(value: Token) {
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
