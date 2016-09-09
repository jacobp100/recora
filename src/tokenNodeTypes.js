// @flow
import type { Entity } from './types/entity';

export type TokenNodeType = string;
export type TokenNode = { type: TokenNodeType, value?: any, start?: number, end?: number };

export const TOKEN_OPERATOR_EXPONENT: TokenNodeType = 'TOKEN_OPERATOR_EXPONENT';
export const TOKEN_OPERATOR_MULTIPLY: TokenNodeType = 'TOKEN_OPERATOR_MULTIPLY';
export const TOKEN_OPERATOR_DIVIDE: TokenNodeType = 'TOKEN_OPERATOR_DIVIDE';
export const TOKEN_OPERATOR_ADD: TokenNodeType = 'TOKEN_OPERATOR_ADD';
export const TOKEN_OPERATOR_SUBTRACT: TokenNodeType = 'TOKEN_OPERATOR_SUBTRACT';
export const TOKEN_OPERATOR_NEGATE: TokenNodeType = 'TOKEN_OPERATOR_NEGATE';
export const TOKEN_NUMBER: TokenNodeType = 'TOKEN_NUMBER';
export const TOKEN_UNIT_NAME: TokenNodeType = 'TOKEN_UNIT_NAME';
export const TOKEN_UNIT_PREFIX: TokenNodeType = 'TOKEN_UNIT_PREFIX';
export const TOKEN_UNIT_SUFFIX: TokenNodeType = 'TOKEN_UNIT_SUFFIX';
export const TOKEN_BRACKET_OPEN: TokenNodeType = 'TOKEN_BRACKET_OPEN';
export const TOKEN_BRACKET_CLOSE: TokenNodeType = 'TOKEN_BRACKET_CLOSE';
export const TOKEN_COLOR: TokenNodeType = 'TOKEN_COLOR';
export const TOKEN_NOOP: TokenNodeType = 'TOKEN_NOOP';
export const TOKEN_VECTOR_START: TokenNodeType = 'TOKEN_VECTOR_START';
export const TOKEN_VECTOR_SEPARATOR: TokenNodeType = 'TOKEN_VECTOR_SEPARATOR';
export const TOKEN_VECTOR_END: TokenNodeType = 'TOKEN_VECTOR_END';

export const NODE_BRACKETS: TokenNodeType = 'NODE_BRACKETS';
export type NodeBrackets = TokenNode & { type: 'NODE_BRACKETS', value: number };
export const NODE_FUNCTION: TokenNodeType = 'NODE_FUNCTION';
export type NodeFunction = TokenNode & { type: 'NODE_FUNCTION', value: number };
export const NODE_MISC_GROUP: TokenNodeType = 'NODE_MISC_GROUP';
export type NodeMiscGroup = TokenNode & { type: 'NODE_MISC_GROUP', value: number };
export const NODE_ENTITY: TokenNodeType = 'NODE_ENTITY';
export type NodeEntity = TokenNode & { type: 'NODE_ENTITY', value: Entity };
