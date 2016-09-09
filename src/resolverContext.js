// @flow
import type { ConversionDescriptors } from './data/units';

export type ResolverContext = { conversionDescriptors: ConversionDescriptors };

export const defaultContext: ResolverContext = {
  conversionDescriptors: {},
};

export const setUnits = (
  context: ResolverContext,
  conversionDescriptors: ConversionDescriptors
): ResolverContext => ({
  ...context,
  conversionDescriptors,
});
