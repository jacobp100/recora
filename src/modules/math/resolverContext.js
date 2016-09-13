// @flow
import { set } from 'lodash/fp';
import type { ConversionDescriptors } from './types';

export type ResolverContext = {
  conversionDescriptors: ConversionDescriptors,
  setUnits: (conversionDescriptors: ConversionDescriptors) => ResolverContext,
};

const defaultContext: ResolverContext = {
  conversionDescriptors: {},
  setUnits(conversionDescriptors: ConversionDescriptors): ResolverContext {
    return set('conversionDescriptors', conversionDescriptors, this);
  },
};
export default defaultContext;
