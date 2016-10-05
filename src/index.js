// @flow
import { flow, reject, map, pick } from 'lodash/fp';
import { TOKEN_NOOP } from './tokenTypes';
import createTokenizerWithLocale from './tokenizer';
import enTokenizerLocale from './tokenizerLocales/en';
import transformer from './transformer';
import { resolver, defaultContext } from './modules/math';
import defaultFormatter from './modules/math-formatter';
import units from '../data/units';
import type { Tokenizer } from './modules/tokenizer/types';
import type { ResolverContext } from './modules/math/types';
import type { Formatter } from './modules/math-formatter/types';

const cleanTokens = flow(
  reject({ type: TOKEN_NOOP }),
  reject(({ start, end }) => start >= end),
  map(pick(['type', 'start', 'end']))
);

export default class Recora {
  tokenizer: Tokenizer
  resolverContext: ResolverContext
  resolver: typeof resolver
  formatter: Formatter

  constructor({ locale = 'en' }: { locale: string } = {}) {
    const tokenizer = createTokenizerWithLocale(enTokenizerLocale);
    this.tokenizer = tokenizer;

    const resolverContext = defaultContext.setUnits(units);
    this.resolverContext = resolverContext;
    this.resolver = resolver.setContext(resolverContext);

    this.formatter = defaultFormatter.setLocale(locale);
  }

  getResult(text: string) {
    const { tokenizer, resolver } = this;

    const tokenOptions = tokenizer(text);
    let result;

    for (const tokens of tokenOptions) {
      const ast = transformer(tokens);
      result = ast ? resolver.resolve(ast) : null;
      if (result) return { result, tokens };
    }

    return null;
  }

  parse(text: string) {
    const value = this.getResult(text);
    if (!value) return null;

    const { resolverContext, formatter } = this;
    const { result, tokens } = value;

    return {
      text,
      result,
      pretty: formatter.format(resolverContext, result),
      tokens: cleanTokens(tokens),
    };
  }
}
