// @flow
import { multiply, mapValues } from 'lodash/fp';
import gamma from 'gamma';
import mathp from 'mathp';
import { convertToFundamentalUnits, isUnitless } from '../../types/entity';
import { NODE_ENTITY } from '../../types';
import type { ResolverContext, EntityNode } from '../../types'; // eslint-disable-line
import {
  FUNCTION_SQRT, FUNCTION_CBRT, FUNCTION_NEGATE, FUNCTION_ROUND, FUNCTION_FLOOR, FUNCTION_CEIL,
  FUNCTION_ABS, FUNCTION_FROUND, FUNCTION_TRUNC, FUNCTION_SIGN, FUNCTION_CLZ32, FUNCTION_FACTORIAL,
  FUNCTION_SIN, FUNCTION_COS, FUNCTION_TAN, FUNCTION_LOG, FUNCTION_LOG1P, FUNCTION_LOG10,
  FUNCTION_LOG2, FUNCTION_ACOSH, FUNCTION_ASINH, FUNCTION_ATANH, FUNCTION_COSH, FUNCTION_SINH,
  FUNCTION_TANH, FUNCTION_SINC, FUNCTION_SEC, FUNCTION_CSC, FUNCTION_COT, FUNCTION_ASEC,
  FUNCTION_ACSC, FUNCTION_ACOT, FUNCTION_SECH, FUNCTION_CSCH, FUNCTION_COTH, FUNCTION_ASECH,
  FUNCTION_ACSCH, FUNCTION_ACOTH, FUNCTION_COSC, FUNCTION_TANC,
} from '..';

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
export const log = unitlessFunction(Math.log);

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
  [FUNCTION_SQRT, [NODE_ENTITY], sqrt],
  [FUNCTION_CBRT, [NODE_ENTITY], cbrt],
  [FUNCTION_NEGATE, [NODE_ENTITY], negate],
  [FUNCTION_ROUND, [NODE_ENTITY], round],
  [FUNCTION_FLOOR, [NODE_ENTITY], floor],
  [FUNCTION_CEIL, [NODE_ENTITY], ceil],
  [FUNCTION_ABS, [NODE_ENTITY], abs],
  [FUNCTION_FROUND, [NODE_ENTITY], fround],
  [FUNCTION_TRUNC, [NODE_ENTITY], trunc],
  [FUNCTION_SIGN, [NODE_ENTITY], sign],
  [FUNCTION_CLZ32, [NODE_ENTITY], clz32],
  [FUNCTION_FACTORIAL, [NODE_ENTITY], factorial],
  [FUNCTION_SIN, [NODE_ENTITY], sin],
  [FUNCTION_COS, [NODE_ENTITY], cos],
  [FUNCTION_TAN, [NODE_ENTITY], tan],
  [FUNCTION_LOG, [NODE_ENTITY], log],
  [FUNCTION_LOG1P, [NODE_ENTITY], log1p],
  [FUNCTION_LOG10, [NODE_ENTITY], log10],
  [FUNCTION_LOG2, [NODE_ENTITY], log2],
  [FUNCTION_ACOSH, [NODE_ENTITY], acosh],
  [FUNCTION_ASINH, [NODE_ENTITY], asinh],
  [FUNCTION_ATANH, [NODE_ENTITY], atanh],
  [FUNCTION_COSH, [NODE_ENTITY], cosh],
  [FUNCTION_SINH, [NODE_ENTITY], sinh],
  [FUNCTION_TANH, [NODE_ENTITY], tanh],
  [FUNCTION_SINC, [NODE_ENTITY], sinc],
  [FUNCTION_SEC, [NODE_ENTITY], sec],
  [FUNCTION_CSC, [NODE_ENTITY], csc],
  [FUNCTION_COT, [NODE_ENTITY], cot],
  [FUNCTION_ASEC, [NODE_ENTITY], asec],
  [FUNCTION_ACSC, [NODE_ENTITY], acsc],
  [FUNCTION_ACOT, [NODE_ENTITY], acot],
  [FUNCTION_SECH, [NODE_ENTITY], sech],
  [FUNCTION_CSCH, [NODE_ENTITY], csch],
  [FUNCTION_COTH, [NODE_ENTITY], coth],
  [FUNCTION_ASECH, [NODE_ENTITY], asech],
  [FUNCTION_ACSCH, [NODE_ENTITY], acsch],
  [FUNCTION_ACOTH, [NODE_ENTITY], acoth],
  [FUNCTION_COSC, [NODE_ENTITY], cosc],
  [FUNCTION_TANC, [NODE_ENTITY], tanc],
];
