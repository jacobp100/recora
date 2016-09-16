// @flow

type Flip2<A, B, C, D> = (fn: (a: A, b: B, c: C) => D) => (a: A, c: C, b: B) => D;

export const flip2: Flip2<any, any, any, any> = // eslint-disable-line
  fn => (context, left, right) => fn(context, right, left);
