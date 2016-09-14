// @flow
import type { ResolverContext, Node } from '../math/types';

export type FormattingHints = { [key: string]: any };
export type NodeFormattingFunction = (
  context: ResolverContext,
  FormattingHints: FormattingHints,
  value: Node
) => string;
export type NodeFormatter = { [key: string]: NodeFormattingFunction };
export type Formatter = {
  nodeFormatters: NodeFormatter,
  setLocale: (locale: string) => Formatter,
  format: NodeFormattingFunction,
};
