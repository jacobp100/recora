// @flow
import { flow, reject, map, pick } from 'lodash/fp';
import { TOKEN_NOOP } from './tokenNodeTypes';
import tokenizer from './tokenizer';
import transformer from './transformer';
import resolver from './resolver';
import { defaultContext, setUnits } from './resolverContext';
import units from './data/units';

const cleanTokens = flow(
  reject({ type: TOKEN_NOOP }),
  map(pick(['type', 'start', 'end']))
);

class Recora {
  resolver: resolver

  constructor() {
    const resolverContext = setUnits(defaultContext, units);
    this.resolver = resolver.setContext(resolverContext);
  }

  parse(text: string) {
    const { resolver } = this;

    const tokenOptions = tokenizer(text);
    let result;

    for (const tokenOption of tokenOptions) {
      const ast = transformer(tokenOption);
      result = ast ? resolver.resolve(ast) : null;

      if (result) {
        const tokens = cleanTokens(tokenOption);
        return { result, tokens };
      }
    }

    return null;
  }
}


const test = '2 cubic meters + 10000 litres';
const output = new Recora().parse(test);
console.log(JSON.stringify(output && output.result));
