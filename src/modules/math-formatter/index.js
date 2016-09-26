// @flow
import { set, reduce } from 'lodash/fp';
import en from './en';
import defaultLocale from './defaultLocale';
import type { Formatter } from './types';

const localeFormatters = {
  en,
};

// Technically allows for composition of locales, so you could do en_GB, base_en, defaultLocale
const formatter: Formatter = {
  locales: [defaultLocale],
  setLocale(locale) {
    return locale in localeFormatters
      ? set('locales', [localeFormatters[locale], defaultLocale], this)
      : set('locales', [defaultLocale], this);
  },
  format(context, node) {
    if (!node) return '';
    const { type } = node;
    const contextWithFormat = set('formatter', this, context);

    return reduce((output, localeFormatter) => {
      if (output) {
        return output;
      } else if (type in localeFormatter) {
        return localeFormatter[type](contextWithFormat, node);
      }
      return '';
    }, '', this.locales);
  },
};
export default formatter;
