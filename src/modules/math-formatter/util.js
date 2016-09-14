// @flow
import { flow, split, map, propertyOf, join } from 'lodash/fp';

/* eslint-disable quote-props */
const powers = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '.': ' ',
  '-': '⁻',
};
/* eslint-enable */

export const formatPower: (value: number | string) => string = flow(
  String,
  split(''),
  map(propertyOf(powers)),
  join(''),
);

export const orderOfMagnitude = (value: number): number => Math.floor(Math.log10(value));
