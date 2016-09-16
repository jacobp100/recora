// @flow
import { curry, flatten, isArray } from 'lodash/fp';
import type { Curry2 } from './utilTypes';

type EveryOtherForm<T> = (startIndex: number) => (array: T[]) => T[];
type PropagateNull<S, T> = (cb: (accum: T, value: S) => ?(T)) => (accum: T, value: S) => ?(T);
type MapUnlessNull<T> = (cb: (value: any) => ?T, array: any[]) => ?(T[]);
type FlatZip<T> = Curry2<T[], T[], T[]>;
type UncastArray<T> = (value: T | T[]) => ?T;

const everyOtherFrom: EveryOtherForm<any> = startIndex => array => {
  const accum = [];
  for (let i = startIndex; i < array.length; i += 2) {
    accum.push(array[i]);
  }
  return accum;
};
export const evenIndexElements = everyOtherFrom(0);
export const oddIndexElements = everyOtherFrom(1);

export const propagateNull: PropagateNull<any, any> = cb =>
  (accum, value) => ((accum === null) ? null : cb(accum, value));

export const mapUnlessNull: MapUnlessNull<any> = (cb, array) => {
  const accum = [];
  for (let i = 0; i < array.length; i += 1) {
    const value = cb(array[i]);
    if (value === null) return null;
    accum[i] = value;
  }
  return accum;
};

export const flatZip: FlatZip<any> = curry((array1, array2) => {
  let accum = [];
  const to = Math.min(array1.length, array2.length);

  for (let i = 0; i < to; i += 1) {
    accum = accum.concat(array1[i], array2[i]);
  }

  if (to < array1.length) {
    accum = accum.concat(flatten(array1.slice(to)));
  } else if (to < array2.length) {
    accum = accum.concat(flatten(array2.slice(to)));
  }

  return accum;
});

export const uncastArray: UncastArray<any> = value => {
  if (!isArray(value) || value.length > 1) {
    return value;
  } else if (value.length === 1) {
    return value[0];
  }
  return null;
};

export const singleArrayValue: UncastArray<any> = value => {
  if (!isArray(value)) {
    return value;
  } else if (value.length === 1) {
    return value[0];
  }
  return null;
};

