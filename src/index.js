// @flow
import { flow, reject, map, pick } from 'lodash/fp';
import type { Tokenizer } from './modules/createTokenizer';
import { TOKEN_NOOP } from './tokenNodeTypes';
import createTokenizerWithLocale from './tokenizer';
import enTokenizerLocale from './tokenizerLocales/en';
import transformer from './transformer';
import resolver from './resolver';
import { defaultContext, setUnits } from './resolverContext';
import units from './data/units';

const cleanTokens = flow(
  reject({ type: TOKEN_NOOP }),
  map(pick(['type', 'start', 'end']))
);

class Recora {
  tokenizer: Tokenizer
  resolver: resolver

  constructor() {
    const tokenizer = createTokenizerWithLocale(enTokenizerLocale);
    this.tokenizer = tokenizer;

    const resolverContext = setUnits(defaultContext, units);
    this.resolver = resolver.setContext(resolverContext);
  }

  parse(text: string) {
    const { tokenizer, resolver } = this;

    const tokenOptions = tokenizer(text);
    let result;

    for (const tokenOption of tokenOptions) {
      const ast = transformer(tokenOption);
      result = ast ? resolver.resolve(ast) : null;

      if (result) {
        const tokens = cleanTokens(tokenOption);
        return { result, tokens };
      }
      return;
    }

    return null;
  }
}


const test = '3 foot 7 inches';
const output = new Recora().parse(test);
console.log(JSON.stringify(output && output.result));
