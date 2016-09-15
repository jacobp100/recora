// @flow
import { assign, update, __, set } from 'lodash/fp';
import type { ConversionDescriptors, DateTime, ResolverContext } from './types';

const defaultContext: ResolverContext = {
  conversionDescriptors: {},
  date: {
    second: 0,
    minute: 0,
    hour: 0,
    date: 1,
    month: 1, // See note in ./types
    year: 1970,
    timezone: 'UTC',
  },
  setUnits(conversionDescriptors: ConversionDescriptors): ResolverContext {
    return set('conversionDescriptors', conversionDescriptors, this);
  },
  setDate(date: DateTime): ResolverContext {
    return update('date', assign(__, date), this);
  },
};
export default defaultContext;
