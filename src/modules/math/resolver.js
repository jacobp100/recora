// @flow
import { set, get, map, forEach } from 'lodash/fp';
import { set as setMut } from 'lodash';
import functions from './functions/definitions';
import {
  NODE_BRACKETS, NODE_FUNCTION, NODE_MISC_GROUP, NODE_CONVERSION, NODE_ENTITY, NODE_COLOR,
  NODE_DATE_TIME, NODE_PERCENTAGE,
} from './types';
import type { // eslint-disable-line
  ResolverContext, Node, BracketsNode, FunctionNode, MiscGroupNode, ConversionNode,
} from './types';
import { resolve as miscGroupResolve } from './types/miscGroup';
import { convert as conversionConvert } from './types/conversion';
import { resolveDefaults as dateTimeResolveDefaults } from './types/dateTime';
import { mapUnlessNull } from '../../util';

type FunctionSignature = [string, string[], Function];

const resolver = {
  functionTrie: {},
  context: {},
  setContext(context: ResolverContext) {
    return set('context', context, this);
  },
  extendFunction(functionName: string, types: string[], fn: Function) {
    return set(['functionTrie', functionName, ...types, '_fn'], fn, this);
  },
  // private: extend function with mutations
  extendFunctionsMut(functions: FunctionSignature[]) {
    forEach(([functionName, types, fn]) => {
      setMut(this, ['functionTrie', functionName, ...types, '_fn'], fn);
    }, functions);
    return this;
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
        const miscGroupNode: MiscGroupNode = value;
        const values = mapUnlessNull(value => this.resolve(value), miscGroupNode.value);
        if (!values) return null;
        return miscGroupResolve(this.context, values);
      }
      case NODE_CONVERSION: {
        const { context } = this;
        const conversionNode: ConversionNode = value;

        const resolvedValue = this.resolve(conversionNode.value);
        if (!resolvedValue) return null;

        return conversionConvert(context, value.units, resolvedValue);
      }
      case NODE_DATE_TIME:
        return dateTimeResolveDefaults(this.context, value);
      case NODE_ENTITY:
      case NODE_PERCENTAGE:
      case NODE_COLOR:
        return value;
      default:
        return null;
    }
  },
  executeFunction(fn: Function) {
    const { name, args: unresolvedArgs } = fn;

    const args = mapUnlessNull(arg => this.resolve(arg), unresolvedArgs);
    if (!args) return null;

    const triePath = map('type', args);
    const func = get(['functionTrie', name, ...triePath, '_fn'], this);
    if (!func) return null;

    return func(this.context, ...args);
  },
};

export default resolver.extendFunctionsMut(functions);
