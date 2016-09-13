// @flow
import { set, get, flow, map } from 'lodash/fp';
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
  FUNCTION_NEGATE,
} from './functions';
import {
  NODE_BRACKETS, NODE_FUNCTION, NODE_MISC_GROUP, NODE_CONVERSION, NODE_ENTITY, NODE_COLOR,
  NODE_DATETIME,
} from './types';
import type { // eslint-disable-line
  Node, BracketsNode, FunctionNode, MiscGroupNode, ConversionNode,
} from './types';
import * as entityOps from './operations/entity';
import * as colorOps from './operations/color';
import { resolve as resolveMiscGroup } from './types/miscGroup';
import { convert } from './types/conversion';
import { mapUnlessNull } from '../../util';

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
  resolve(value: Node): ?Node {
    switch (value.type) {
      case NODE_BRACKETS: {
        const bracketsNode: BracketsNode = value;
        return this.resolve(bracketsNode.value);
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
        */
        const miscGroupNode: MiscGroupNode = value;
        const values = mapUnlessNull(value => this.resolve(value), miscGroupNode.value);
        if (!values) return null;
        return resolveMiscGroup(this.context, values);
      }
      case NODE_CONVERSION: {
        const { context } = this;
        const conversionNode: ConversionNode = value;

        const resolvedValue = this.resolve(conversionNode.value);
        if (!resolvedValue) return null;

        return convert(context, value.units, resolvedValue);
      }
      case NODE_ENTITY:
      case NODE_COLOR:
      case NODE_DATETIME:
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
  .extendFunction(FUNCTION_ADD, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, entityOps.add)
  .extendFunction(FUNCTION_SUBTRACT, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, entityOps.subtract)
  .extendFunction(FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, entityOps.multiply)
  .extendFunction(FUNCTION_DIVIDE, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, entityOps.divide)
  .extendFunction(FUNCTION_EXPONENT, [NODE_ENTITY, NODE_ENTITY], NODE_ENTITY, entityOps.exponent)
  .extendFunction(FUNCTION_NEGATE, [NODE_ENTITY], NODE_ENTITY, entityOps.negate)
  .extendFunction(FUNCTION_ADD, [NODE_COLOR, NODE_COLOR], NODE_COLOR, colorOps.add)
  .extendFunction(FUNCTION_SUBTRACT, [NODE_COLOR, NODE_COLOR], NODE_COLOR, colorOps.subtract)
  .extendFunction(FUNCTION_MULTIPLY, [NODE_COLOR, NODE_COLOR], NODE_COLOR, colorOps.multiply)
  .extendFunction(FUNCTION_DIVIDE, [NODE_COLOR, NODE_COLOR], NODE_COLOR, colorOps.divide)
  ;
/* eslint-enable */
