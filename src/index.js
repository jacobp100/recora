// @flow
import tokenizer from './tokenizer';
import transformer from './transformer';

const parse = (text: string) => {
  const tokenOptions = tokenizer(text);

  /* eslint-disable no-continue */
  for (const tokenOption of tokenOptions) {
    const ast = transformer(tokenOption);
    if (!ast) continue;
    return ast;
  }
  /* eslint-enable */

  return null;
};

const test = '1 meter + 2 meter';
console.log(JSON.stringify(parse(test)));
