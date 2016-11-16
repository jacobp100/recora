// @flow
import { flow, reject, map, pick, set, assign } from 'lodash/fp';
import { TOKEN_NOOP } from './tokenTypes';
import createTokenizerWithLocale from './tokenizer';
import createEnTokenizerLocale from './tokenizerLocales/en';
import transformer from './transformer';
import { resolver, defaultContext } from './modules/math';
import defaultFormatter from './modules/math-formatter';
import units from './units';
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
  userConstants: Object = {}

  constructor({ locale = 'en' }: { locale: string } = {}) {
    const tokenizer = createTokenizerWithLocale(createEnTokenizerLocale({
      userConstants: this.userConstants,
    }));
    this.tokenizer = tokenizer;

    const resolverContext = defaultContext.setUnits(units);
    this.resolverContext = resolverContext;
    this.resolver = resolver.setContext(resolverContext);

    this.formatter = defaultFormatter.setLocale(locale);
  }

  setCustomUnits(customUnits: Object) {
    const newUnits = assign(units, customUnits);
    this.resolverContext = this.resolverContext.setUnits(newUnits);
    this.resolver = this.resolver.setContext(this.resolverContext);
  }

  setConstants(userConstants: Object) {
    this.userConstants = userConstants;
    const tokenizer = createTokenizerWithLocale(createEnTokenizerLocale({
      userConstants: this.userConstants,
    }));
    this.tokenizer = tokenizer;
    return this;
  }

  setConstant(identifier: string, value: any) {
    return this.setConstants(set(identifier, value, this.userConstants));
  }

  setDate(dateObject: Object) {
    this.resolverContext = this.resolverContext.setDate(dateObject);
    this.resolver = this.resolver.setContext(this.resolverContext);
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
      value: result,
      pretty: formatter.format(resolverContext, result),
      tokens: cleanTokens(tokens),
    };
  }
}
