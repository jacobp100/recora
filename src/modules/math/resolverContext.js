// @flow
import { set } from 'lodash/fp';
import type { ConversionDescriptors, ResolverContext } from './types';

const defaultContext: ResolverContext = {
  conversionDescriptors: {},
  setUnits(conversionDescriptors: ConversionDescriptors): ResolverContext {
    return set('conversionDescriptors', conversionDescriptors, this);
  },
};
export default defaultContext;
