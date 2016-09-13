// @flow
import { flow, reject, map, pick } from 'lodash/fp';
import type { Tokenizer } from './modules/tokenizer/types';
import { TOKEN_NOOP } from './tokenTypes';
import createTokenizerWithLocale from './tokenizer';
import enTokenizerLocale from './tokenizerLocales/en';
import transformer from './transformer';
import resolver from './modules/math/resolver';
import defaultContext from './modules/math/resolverContext';
import units from './data/units';

const cleanTokens = flow(
  reject({ type: TOKEN_NOOP }),
  map(pick(['type', 'start', 'end']))
);

export default class Recora {
  tokenizer: Tokenizer
  resolver: resolver

  constructor() {
    const tokenizer = createTokenizerWithLocale(enTokenizerLocale);
    this.tokenizer = tokenizer;

    const resolverContext = defaultContext.setUnits(units);
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
    }

    return null;
  }
}
