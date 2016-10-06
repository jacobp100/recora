// @flow
import { baseEntity } from './types';

export default {
  pi: { ...baseEntity, quantity: Math.PI },
  tau: { ...baseEntity, quantity: 2 * Math.PI },
  e: { ...baseEntity, quantity: Math.E },
  phi: { ...baseEntity, quantity: (1 + Math.sqrt(5)) / 2 },
};
