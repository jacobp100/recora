// @flow
import tokenizer from './tokenizer';
import transformer from './transformer';
import math from './math';

const parse = (text: string) => {
  const tokenOptions = tokenizer(text);

  /* eslint-disable no-continue */
  for (const tokenOption of tokenOptions) {
    const ast = transformer(tokenOption);
    if (!ast) continue;
    const result = math.resolve(ast);
    if (!result) continue;
    return result;
  }
  /* eslint-enable */

  return null;
};

const test = '1 meter + 2 yard';
console.log(JSON.stringify(parse(test)));
