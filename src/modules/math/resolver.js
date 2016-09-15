// @flow
import { set, get, map } from 'lodash/fp';
import { set as setMut } from 'lodash';
import {
  FUNCTION_ADD,
  FUNCTION_SUBTRACT,
  FUNCTION_MULTIPLY,
  FUNCTION_DIVIDE,
  FUNCTION_EXPONENT,
  FUNCTION_NEGATE,
  FUNCTION_FACTORIAL,
} from './functions';
import {
  NODE_BRACKETS, NODE_FUNCTION, NODE_MISC_GROUP, NODE_CONVERSION, NODE_ENTITY, NODE_COLOR,
  NODE_DATE_TIME,
} from './types';
import type { // eslint-disable-line
  ResolverContext, Node, BracketsNode, FunctionNode, MiscGroupNode, ConversionNode,
} from './types';
import * as entityOps from './operations/entity';
import * as colorOps from './operations/color';
import * as dateTimeOps from './operations/dateTime';
import * as dateTimeEntityOps from './operations/dateTimeEntity';
import * as entityFns from './functions/entity';
import { resolve as miscGroupResolve } from './types/miscGroup';
import { convert as conversionConvert } from './types/conversion';
import { resolveDefaults as dateTimeResolveDefaults } from './types/dateTime';
import { mapUnlessNull } from '../../util';

const resolver = {
  functionTrie: {},
  context: {},
  setContext(context: ResolverContext) {
    return set('context', context, this);
  },
  extendFunction(functionName: string, types: string[], fn: Function) {
    return set(['functionTrie', functionName, ...types, '_fn'], fn, this);
  },
  extendFunctionMut(functionName: string, types: string[], fn: Function) {
    setMut(this, ['functionTrie', functionName, ...types, '_fn'], fn);
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

/* eslint-disable max-len */
export default resolver
  .extendFunctionMut(FUNCTION_ADD, [NODE_ENTITY, NODE_ENTITY], entityOps.add)
  .extendFunctionMut(FUNCTION_SUBTRACT, [NODE_ENTITY, NODE_ENTITY], entityOps.subtract)
  .extendFunctionMut(FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_ENTITY], entityOps.multiply)
  .extendFunctionMut(FUNCTION_DIVIDE, [NODE_ENTITY, NODE_ENTITY], entityOps.divide)
  .extendFunctionMut(FUNCTION_EXPONENT, [NODE_ENTITY, NODE_ENTITY], entityOps.exponent)
  .extendFunctionMut(FUNCTION_ADD, [NODE_COLOR, NODE_COLOR], colorOps.add)
  .extendFunctionMut(FUNCTION_SUBTRACT, [NODE_COLOR, NODE_COLOR], colorOps.subtract)
  .extendFunctionMut(FUNCTION_MULTIPLY, [NODE_COLOR, NODE_COLOR], colorOps.multiply)
  .extendFunctionMut(FUNCTION_DIVIDE, [NODE_COLOR, NODE_COLOR], colorOps.divide)
  .extendFunctionMut(FUNCTION_ADD, [NODE_DATE_TIME, NODE_DATE_TIME], dateTimeOps.add)
  .extendFunctionMut(FUNCTION_SUBTRACT, [NODE_DATE_TIME, NODE_DATE_TIME], dateTimeOps.subtract)
  .extendFunctionMut(FUNCTION_ADD, [NODE_DATE_TIME, NODE_ENTITY], dateTimeEntityOps.add)
  .extendFunctionMut(FUNCTION_SUBTRACT, [NODE_DATE_TIME, NODE_ENTITY], dateTimeEntityOps.subtract)
  .extendFunctionMut(FUNCTION_ADD, [NODE_ENTITY, NODE_DATE_TIME], (context, left, right) =>
    dateTimeEntityOps.add(context, right, left))
  .extendFunctionMut(FUNCTION_NEGATE, [NODE_ENTITY], entityFns.negate)
  .extendFunctionMut(FUNCTION_FACTORIAL, [NODE_ENTITY], entityFns.factorial)
  ;
/* eslint-enable */
