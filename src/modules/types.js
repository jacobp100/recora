// @flow
import type { Node } from './math/types';

export type TokenBase = { type: string, value?: any };
export type Token = TokenBase & { start: number, end: number };
export type { Node };
export type TokenNode = Token | Node;
