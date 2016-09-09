// @flow
import type { Units } from './data/units';

export type TokenNode = Object;
export type TokenBase = TokenNode & { value?: any };
export type Token = TokenBase & { start: number, end: number }

export const TOKEN_OPERATOR_EXPONENT = 'TOKEN_OPERATOR_EXPONENT';
export const TOKEN_OPERATOR_MULTIPLY = 'TOKEN_OPERATOR_MULTIPLY';
export const TOKEN_OPERATOR_DIVIDE = 'TOKEN_OPERATOR_DIVIDE';
export const TOKEN_OPERATOR_ADD = 'TOKEN_OPERATOR_ADD';
export const TOKEN_OPERATOR_SUBTRACT = 'TOKEN_OPERATOR_SUBTRACT';
export const TOKEN_OPERATOR_NEGATE = 'TOKEN_OPERATOR_NEGATE';
export const TOKEN_NUMBER = 'TOKEN_NUMBER';
export const TOKEN_UNIT_NAME = 'TOKEN_UNIT_NAME';
export const TOKEN_UNIT_PREFIX = 'TOKEN_UNIT_PREFIX';
export const TOKEN_UNIT_SUFFIX = 'TOKEN_UNIT_SUFFIX';
export const TOKEN_BRACKET_OPEN = 'TOKEN_BRACKET_OPEN';
export const TOKEN_BRACKET_CLOSE = 'TOKEN_BRACKET_CLOSE';
export const TOKEN_COLOR = 'TOKEN_COLOR';
export const TOKEN_NOOP = 'TOKEN_NOOP';
export const TOKEN_VECTOR_START = 'TOKEN_VECTOR_START';
export const TOKEN_VECTOR_SEPARATOR = 'TOKEN_VECTOR_SEPARATOR';
export const TOKEN_VECTOR_END = 'TOKEN_VECTOR_END';

export const NODE_BRACKETS = 'NODE_BRACKETS';
export type BracketsNode =
  TokenNode & { type: 'NODE_BRACKETS', value: TokenNode };

export const NODE_FUNCTION = 'NODE_FUNCTION';
export type FunctionNode =
  TokenNode & { type: 'NODE_FUNCTION', name: string, args: TokenNode[] };

export const NODE_MISC_GROUP = 'NODE_MISC_GROUP';
export type MiscGroupNode =
  TokenNode & { type: 'NODE_MISC_GROUP', value: TokenNode[] };

export const NODE_ENTITY = 'NODE_ENTITY';
export type EntityNode =
  TokenNode & { type: 'NODE_ENTITY', quantity: number, units: Units };

export const NODE_CONVERSION = 'NODE_CONVERSION';
export type ConversionNode =
  TokenNode & { type: 'NODE_CONVERSION', value: TokenNode, units: Units[] };
