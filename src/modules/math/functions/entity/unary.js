// @flow
import { multiply, mapValues } from 'lodash/fp';
import gamma from 'gamma';
import mathp from 'mathp';
import { convertToFundamentalUnits, isUnitless } from '../../types/entity';
import { NODE_ENTITY } from '../../types';
import type { ResolverContext, EntityNode } from '../../types'; // eslint-disable-line
import { FUNCTION_NEGATE, FUNCTION_FACTORIAL } from '..';

const unitlessFunction = (fn: (value: number) => number) => (
  context: ResolverContext,
  entity: EntityNode
): ?EntityNode => {
  const fundamental = convertToFundamentalUnits(context, entity);
  return fundamental && isUnitless(fundamental)
    ? { type: NODE_ENTITY, quantity: fn(fundamental.quantity), units: {} }
    : null;
};

const quantityFn = (fn: (value: number) => number) => (
  context: ResolverContext,
  entity: EntityNode
): ?EntityNode => ({
  type: NODE_ENTITY,
  quantity: fn(entity.quantity),
  units: entity.units,
});

const powerFn = (power: number) => (
  context: ResolverContext,
  entity: EntityNode
): ?EntityNode => (
  entity.quantity >= 0
    ? {
      type: NODE_ENTITY,
      quantity: Math.pow(entity.quantity, 1 / power),
      units: mapValues(multiply(1 / power), entity.units),
    }
    : null
);


export const sqrt = powerFn(2);
export const cbrt = powerFn(3);

export const negate = quantityFn(x => -x);
export const round = quantityFn(Math.round);
export const floor = quantityFn(Math.floor);
export const ceil = quantityFn(Math.ceil);
export const abs = quantityFn(Math.abs);
export const fround = quantityFn(mathp.fround);
export const trunc = quantityFn(mathp.trunc);
export const sign = quantityFn(mathp.sign);
export const clz32 = quantityFn(mathp.clz32);

export const factorial = unitlessFunction(value => gamma(value + 1));

// Fix annoying sin values
export const sin = unitlessFunction(x => ((x % Math.PI !== 0) ? Math.sin(x) : 0));
export const cos = unitlessFunction(Math.cos);
export const tan = unitlessFunction(Math.tan);
export const ln = unitlessFunction(Math.log);
// export const log = ln;

export const log1p = unitlessFunction(mathp.log1p);
export const log10 = unitlessFunction(mathp.log10);
export const log2 = unitlessFunction(mathp.log2);

export const acosh = unitlessFunction(mathp.acosh);
export const asinh = unitlessFunction(mathp.asinh);
export const atanh = unitlessFunction(mathp.atanh);
export const cosh = unitlessFunction(mathp.cosh);
export const sinh = unitlessFunction(mathp.sinh);
export const tanh = unitlessFunction(mathp.tanh);

export const sinc = unitlessFunction(mathp.sinc);
export const sec = unitlessFunction(mathp.sec);
export const csc = unitlessFunction(mathp.csc);
export const cot = unitlessFunction(mathp.cot);
export const asec = unitlessFunction(mathp.asec);
export const acsc = unitlessFunction(mathp.acsc);
export const acot = unitlessFunction(mathp.acot);
export const sech = unitlessFunction(mathp.sech);
export const csch = unitlessFunction(mathp.csch);
export const coth = unitlessFunction(mathp.coth);
export const asech = unitlessFunction(mathp.asech);
export const acsch = unitlessFunction(mathp.acsch);
export const acoth = unitlessFunction(mathp.acoth);

export const cosc = unitlessFunction(x => Math.cos(x) / x);
export const tanc = unitlessFunction(x => ((x === 0) ? 1 : Math.tan(x) / x));

export default [
  [FUNCTION_NEGATE, [NODE_ENTITY], negate],
  [FUNCTION_FACTORIAL, [NODE_ENTITY], factorial],
];
