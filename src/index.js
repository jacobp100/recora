// @flow
import tokenizer from './tokenizer';
import transformer from './transformer';
import resolver from './resolver';
import conversionDescriptors from './data/units';

class Recora {
  resolver: resolver

  constructor() {
    this.resolver = resolver.setContext({ conversionDescriptors });
  }

  parse(text: string) {
    const tokenOptions = tokenizer(text);

    /* eslint-disable no-continue */
    for (const tokenOption of tokenOptions) {
      const ast = transformer(tokenOption);
      if (!ast) continue;
      const result = this.resolver.resolve(ast);
      if (!result) continue;
      return result;
    }
    /* eslint-enable */

    return null;
  }
}


const test = '1 meter + 2 yard';
console.log(JSON.stringify(new Recora().parse(test)));
