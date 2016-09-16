// @flow
import { NODE_ENTITY, NODE_PERCENTAGE } from '../types';
import type { ResolverContext, EntityNode, PercentageNode } from '../types'; // eslint-disable-line
import { FUNCTION_ADD, FUNCTION_SUBTRACT, FUNCTION_MULTIPLY, FUNCTION_DIVIDE } from '.';
import { flip2 } from './util';


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

export default [
  [FUNCTION_ADD, [NODE_ENTITY, NODE_PERCENTAGE], addMath],
  [FUNCTION_SUBTRACT, [NODE_ENTITY, NODE_PERCENTAGE], subtractMath],
  [FUNCTION_MULTIPLY, [NODE_ENTITY, NODE_PERCENTAGE], multiplyMath],
  [FUNCTION_DIVIDE, [NODE_ENTITY, NODE_PERCENTAGE], divideMath],
  [FUNCTION_MULTIPLY, [NODE_PERCENTAGE, NODE_ENTITY], flip2(multiplyMath)],
];
