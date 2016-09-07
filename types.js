// @flow

export const OPERATOR_EXPONENT = 'exponent';
export const OPERATOR_MULTIPLY = 'multiply';
export const OPERATOR_DIVIDE = 'divide';
export const OPERATOR_ADD = 'add';
export const OPERATOR_SUBTRACT = 'subtract';
export const OPERATOR_NEGATE = 'negate';

export type TokenType = string;

export const TOKEN_OPERATOR: TokenType = 'operator';
export const TOKEN_NUMBER: TokenType = 'number';
export const TOKEN_UNIT_NAME: TokenType = 'unit-name';
export const TOKEN_UNIT_PREFIX: TokenType = 'unit-prefix';
export const TOKEN_UNIT_SUFFIX: TokenType = 'unit-suffix';
export const TOKEN_BRACKET_OPEN: TokenType = 'open-bracket';
export const TOKEN_BRACKET_CLOSE: TokenType = 'close-bracket';
export const TOKEN_COLOR: TokenType = 'color';
export const TOKEN_NOOP: TokenType = 'noop';
export const TOKEN_VECTOR_START: TokenType = 'vector-start';
export const TOKEN_VECTOR_SEPARATOR: TokenType = 'vector-separator';
export const TOKEN_VECTOR_END: TokenType = 'vector-end';

export type Token = { type: TokenType, value?: any, start?: number, end?: number };
