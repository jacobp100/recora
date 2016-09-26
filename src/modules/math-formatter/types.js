// @flow
import type { ResolverContext, Node } from '../math/types';

export type NodeFormattingFunction = (
  context: ResolverContext,
  value: Node
) => string;
export type Locale = { [key: string]: NodeFormattingFunction };
export type Formatter = {
  locales: Locale[],
  setLocale: (locale: string) => Formatter,
  format: NodeFormattingFunction,
};
