// @flow
import { set } from 'lodash/fp';
import type { ConversionDescriptors } from './data/units';

export type ResolverContext = { conversionDescriptors: ConversionDescriptors };

const defaultContext: ResolverContext = {
  conversionDescriptors: {},
  setUnits(conversionDescriptors: ConversionDescriptors): ResolverContext {
    return set('conversionDescriptors', conversionDescriptors, this);
  },
};
export default defaultContext;
