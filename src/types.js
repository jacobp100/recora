// @flow

export type TokenType = string;
export type Token = { type: TokenType, value?: any, start?: number, end?: number };

export const TOKEN_OPERATOR_EXPONENT: TokenType = 'TOKEN_OPERATOR_EXPONENT';
export const TOKEN_OPERATOR_MULTIPLY: TokenType = 'TOKEN_OPERATOR_MULTIPLY';
export const TOKEN_OPERATOR_DIVIDE: TokenType = 'TOKEN_OPERATOR_DIVIDE';
export const TOKEN_OPERATOR_ADD: TokenType = 'TOKEN_OPERATOR_ADD';
export const TOKEN_OPERATOR_SUBTRACT: TokenType = 'TOKEN_OPERATOR_SUBTRACT';
export const TOKEN_OPERATOR_NEGATE: TokenType = 'TOKEN_OPERATOR_NEGATE';
export const TOKEN_NUMBER: TokenType = 'TOKEN_NUMBER';
export const TOKEN_UNIT_NAME: TokenType = 'TOKEN_UNIT_NAME';
export const TOKEN_UNIT_PREFIX: TokenType = 'TOKEN_UNIT_PREFIX';
export const TOKEN_UNIT_SUFFIX: TokenType = 'TOKEN_UNIT_SUFFIX';
export const TOKEN_BRACKET_OPEN: TokenType = 'TOKEN_BRACKET_OPEN';
export const TOKEN_BRACKET_CLOSE: TokenType = 'TOKEN_BRACKET_CLOSE';
export const TOKEN_COLOR: TokenType = 'TOKEN_COLOR';
export const TOKEN_NOOP: TokenType = 'TOKEN_NOOP';
export const TOKEN_VECTOR_START: TokenType = 'TOKEN_VECTOR_START';
export const TOKEN_VECTOR_SEPARATOR: TokenType = 'TOKEN_VECTOR_SEPARATOR';
export const TOKEN_VECTOR_END: TokenType = 'TOKEN_VECTOR_END';

export const NODE_BRACKETS: TokenType = 'NODE_BRACKETS';
export const NODE_OPERATOR_UNARY: TokenType = 'NODE_OPERATOR_UNARY';
export const NODE_OPERATOR_BILINEAR: TokenType = 'NODE_OPERATOR_BILINEAR';
export const NODE_ENTITY: TokenType = 'NODE_ENTITY';
export const NODE_MISC_GROUP: TokenType = 'NODE_MISC_GROUP';
