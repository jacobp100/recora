// @flow
import { update, add, flow } from 'lodash/fp';
import gamma from 'gamma';
import { convertToFundamentalUnits, isUnitless } from '../types/entity';
import { NODE_ENTITY } from '../types';
import type { ResolverContext, EntityNode } from '../types'; // eslint-disable-line

export const negate = (context: ResolverContext, entity: EntityNode): EntityNode => ({
  type: NODE_ENTITY,
  quantity: -entity.quantity,
  units: entity.units,
});

export const factorial = (context: ResolverContext, entity: EntityNode): ?EntityNode => {
  const fundamental = convertToFundamentalUnits(context, entity);
  return fundamental && isUnitless(fundamental)
    ? update('quantity', flow(add(1), gamma), fundamental)
    : null;
};
