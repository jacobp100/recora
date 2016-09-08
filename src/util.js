const everyOtherFrom = from => array => {
  const out = [];
  for (let i = from; i < array.length; i += 2) {
    out.push(array[i]);
  }
  return out;
};
export const evenIndexElements = everyOtherFrom(0);
export const oddIndexElements = everyOtherFrom(1);

export const propagateNull = cb => (accum, value) => ((accum === null) ? null : cb(accum, value));
