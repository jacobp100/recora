// @flow
import { NODE_ENTITY } from '../types';
import type { ResolverContext, EntityNode, PercentageNode } from '../types'; // eslint-disable-line


const transform = (transform: (entityValue: number, percentageValue: number) => number) => (
  context: ResolverContext,
  entity: EntityNode,
  percentage: PercentageNode
): EntityNode => ({
  type: NODE_ENTITY,
  quantity: transform(entity.quantity, percentage.value),
  units: entity.units,
});

const addMath = transform((entityValue, percentageValue) => (
  entityValue * ((100 + percentageValue) / 100)
));

const subtractMath = transform((entityValue, percentageValue) => (
  entityValue * ((100 - percentageValue) / 100)
));

const multiplyMath = transform((entityValue, percentageValue) => (
  entityValue * (percentageValue / 100)
));

const divideMath = transform((entityValue, percentageValue) => (
  entityValue / (percentageValue / 100)
));

export {
  addMath as add,
  subtractMath as subtract,
  multiplyMath as multiply,
  divideMath as divide,
};
