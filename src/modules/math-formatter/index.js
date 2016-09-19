// @flow
import { set, assign } from 'lodash/fp';
import en from './en';
import defaultFormatter from './defaultFormatter';
import type { Formatter } from './types';

const formatters = {
  en,
};

const formatter: Formatter = {
  nodeFormatters: defaultFormatter,
  setLocale(locale) {
    return locale in formatters
      ? set('nodeFormatters', assign(defaultFormatter, formatters[locale]), this)
      : this;
  },
  format(context, formattingHints, node) {
    if (!node) return '';
    const formatter = this.nodeFormatters[node.type];
    if (!formatter) return '';
    const contextWithFormat = set('formatter', this, context);
    return formatter(contextWithFormat, formattingHints, node);
  },
};
export default formatter;
