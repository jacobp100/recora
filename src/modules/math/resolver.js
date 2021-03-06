// @flow
import { set, get, map, forEach } from 'lodash/fp';
import { set as setMut } from 'lodash';
import functions from './functions/definitions';
import {
  NODE_BRACKETS, NODE_FUNCTION, NODE_ASSIGNMENT, NODE_MISC_GROUP, NODE_CONVERSION, NODE_ENTITY,
  NODE_COLOR, NODE_DATE_TIME, NODE_PERCENTAGE, NODE_COMPOSITE_ENTITY, baseAssignment,
} from './types';
import type { // eslint-disable-line
  ResolverContext, Node, BracketsNode, FunctionNode, AssignmentNode, MiscGroupNode, ConversionNode,
} from './types';
import { resolve as miscGroupResolve } from './types/miscGroup';
import { convert as conversionConvert } from './types/conversion';
import { resolveDefaults as dateTimeResolveDefaults } from './types/dateTime';
import { mapUnlessNull } from '../../util';

const resolver = {
  typedFunctionTrie: {},
  variadicFunctions: {},
  context: {},
  setContext(context: ResolverContext) {
    return set('context', context, this);
  },
  extendFunction(functionName: string, types: string[], fn: Function) {
    return set(['typedFunctionTrie', functionName, ...types, '_fn'], fn, this);
  },
  resolve(value: Node): ?Node {
    if (!value) return null;
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

        return conversionConvert(context, value, resolvedValue);
      }
      case NODE_ASSIGNMENT: {
        const assignmentNode: AssignmentNode = value;

        const resolvedValue = this.resolve(assignmentNode.value);
        if (!resolvedValue) return null;

        return { ...baseAssignment, value: resolvedValue, identifier: assignmentNode.identifier };
      }
      case NODE_DATE_TIME:
        return dateTimeResolveDefaults(this.context, value);
      case NODE_ENTITY:
      case NODE_COMPOSITE_ENTITY:
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
    let func = get(['typedFunctionTrie', name, ...triePath, '_fn'], this);
    if (!func) func = get(['variadicFunctions', name], this);
    if (!func) return null;

    return func(this.context, ...args);
  },
};

forEach(([functionName, types, fn]) => {
  if (types) {
    setMut(resolver, ['typedFunctionTrie', functionName, ...types, '_fn'], fn);
  } else {
    resolver.variadicFunctions[functionName] = fn;
  }
}, functions);


export default resolver;
