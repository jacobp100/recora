// @flow
import { set, get, flow, map, every } from 'lodash/fp';
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
} from './functions';
import { NODE_BRACKETS, NODE_FUNCTION, NODE_MISC_GROUP, NODE_ENTITY } from './tokenNodeTypes';
import type { TokenNode } from './tokenNodeTypes'; // eslint-disable-line
import {
  add as addEntityToEntity,
  subtract as subtractEntityFromEntity,
  multiply as multiplyEntityByEntity,
  divide as divideEntityByEntity,
  exponent as exponentEntityByEntity,
} from './math/entity';
import { resolveMiscGroup } from './types/miscGroup';
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
      case NODE_BRACKETS:
        return this.resolve(value.value);
      case NODE_FUNCTION:
        return this.executeFunction(value.value);
      case NODE_MISC_GROUP: {
        /*
        Should this be implemented a function or something?

        We don't have arbitrarily variadic functions---do we want them?

        A lot of places create misc groups and then compact them---making it a function could add a
        lot of overhead

        Also, what about when this needs to take more than entities: dates were handled in the
        previous version. Should nodes really be the type themselves?
        */
        const values = mapUnlessNull(value => this.resolve(value), value.value);
        if (!values) return null;
        if (!every({ type: NODE_ENTITY }, values)) return null;
        const entities = map('value', values);
        return resolveMiscGroup(this.context, entities);
      }
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
