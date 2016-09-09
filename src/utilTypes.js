// @flow
export type Curry2<A, B, C> =
  ((a: A, b: B) => C) &
  ((a: A) => (b: B) => C);

export type Curry3<A, B, C, D> =
  ((a: A, b: B, c: C) => D) &
  ((a: A, b: B) => (c: C) => D) &
  ((a: A) => (b: B) => (c: C) => D);
