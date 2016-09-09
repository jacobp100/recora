type EveryOtherForm<T> = (startIndex: number) => (array: T[]) => T[];
type PropagateNull<S, T> = (cb: (accum: T, value: S) => ?(T)) => (accum: T, value: S) => ?(T);
type MapUnlessNull<T> = (cb: (value: any) => ?T, array: any[]) => ?(T[]);

const everyOtherFrom: EveryOtherForm<*> = startIndex => array => {
  const accum = [];
  for (let i = startIndex; i < array.length; i += 2) {
    accum.push(array[i]);
  }
  return accum;
};
export const evenIndexElements = everyOtherFrom(0);
export const oddIndexElements = everyOtherFrom(1);

export const propagateNull: PropagateNull<*, *> = cb =>
  (accum, value) => ((accum === null) ? null : cb(accum, value));

export const mapUnlessNull: MapUnlessNull<*> = (cb, array) => {
  const accum = [];
  for (let i = 0; i < array.length; i += 1) {
    const value = cb(array[i]);
    if (value === null) return null;
    accum[i] = value;
  }
  return accum;
};
