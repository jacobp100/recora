// @flow
import { set, get, flow, map } from 'lodash/fp';
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
} from './functions';
import { NODE_BRACKETS, NODE_FUNCTION, NODE_MISC_GROUP, NODE_ENTITY } from './tokenNodeTypes';
import type { // eslint-disable-line
  TokenNode, BracketsNode, FunctionNode, MiscGroupNode,
} from './tokenNodeTypes';
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
      case NODE_BRACKETS: {
        const bracketsNode: BracketsNode = value;
        return this.resolve(bracketsNode);
      }
      case NODE_FUNCTION: {
        const functionNode: FunctionNode = value;
        return this.executeFunction(functionNode);
      }
      case NODE_MISC_GROUP: {
        /*
        Should this be implemented a function or something?

        We don't have arbitrarily variadic functions---do we want them?

        A lot of places create misc groups and then compact them---making it a function could add a
        lot of overhead

        Also, what about when this needs to take more than entities: dates were handled in the
        previous version. Should nodes really be the type themselves?
        */
        const miscGroupNode: MiscGroupNode = value;
        const values = mapUnlessNull(value => this.resolve(value), miscGroupNode.value);
        if (!values) return null;
        return resolveMiscGroup(this.context, values);
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
    const func = get(['functionTrie', name, ...triePath, '_fn'], this);
    if (!func) return null;

    return func(this.context, ...args);
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
