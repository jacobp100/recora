// @flow
import { set, get, flow, map } from 'lodash/fp';
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
} from './functions';
import { NODE_FUNCTION, NODE_ENTITY } from './tokenNodeTypes';
import type { TokenNode } from './tokenNodeTypes'; // eslint-disable-line
import {
  add as addEntityToEntity,
  subtract as subtractEntityFromEntity,
  multiply as multiplyEntityByEntity,
  divide as divideEntityByEntity,
  exponent as exponentEntityByEntity,
} from './math/entity';
import { mapUnlessNull } from './util';

const resolver = {
  functionTrie: {},
  context: {},
  setContext(context) {
    return set('context', context, this);
  },
  extendFunction(functionName, types, type, fn) {
    const path = ['functionTrie', functionName, ...types];
    return flow(
      set([...path, '_fn'], fn),
      set([...path, '_type'], type)
    )(this);
  },
  resolve(value: TokenNode): ?TokenNode {
    switch (value.type) {
      case NODE_FUNCTION:
        return this.executeFunction(value.value);
      case NODE_ENTITY:
        return value;
      default:
        return null;
    }
  },
  executeFunction(fn) {
    const { name, args: unresolvedArgs } = fn;

    const args = mapUnlessNull(arg => this.resolve(arg), unresolvedArgs);
    if (!args) return null;

    const triePath = map('type', args);
    const { _fn: func, _type: type } = get(['functionTrie', name, ...triePath], this);
    if (!func) return null;

    const argValues = map('value', args);
    const value = func(this.context, ...argValues);
    if (!value) return null;

    return { type, value };
  },
};

/* eslint-disable max-len */
export default resolver
  .extendFunction(FUNCTION_ADD, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, addEntityToEntity)
  .extendFunction(FUNCTION_SUBTRACT, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, subtractEntityFromEntity)
  .extendFunction(FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, multiplyEntityByEntity)
  .extendFunction(FUNCTION_DIVIDE, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, divideEntityByEntity)
  .extendFunction(FUNCTION_EXPONENT, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, exponentEntityByEntity);
/* eslint-enable */
