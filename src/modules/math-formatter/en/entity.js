// @flow
import { isEqual, toPairs, reduce, stubTrue, cond, getOr } from 'lodash/fp';
import type { EntityNode, ResolverContext } from '../../math/types';
import { convertToFundamentalUnits } from '../../math/types/entity';
import type { FormattingHints } from '../types';
import unitFormatting from '../data/en-formatting';
import { formatPower, orderOfMagnitude } from '../util';


/* eslint-disable quote-props */
const baseNames = {
  '2': '0b',
  '8': '0o',
  '10': '',
  '16': '0x',
};
/* eslint-enable */

const formatUnits = (value, units) => reduce((value, [unit, power]) => {
  if (unit.power > 1) {
    return `${value} ${unit}^${formatPower(power)}`;
  } else if (unit.power < -1) {
    return `${value} per ${unit}^${formatPower(power)}`;
  } else if (unit.power === -1) {
    return `${value} per ${unit}`;
  }
  // power is 1
  if (unit in unitFormatting) {
    const [title, position] = unitFormatting[unit];
    return position === 'suffix'
      ? `${value}${title}`
      : `${title}${value}`;
  }
  return `${value} ${unit}`;
}, value, toPairs(units));

const isCurrency = (context, formattingHints, entity) =>
  !formattingHints.base &&
  !formattingHints.decimalPlaces &&
  !formattingHints.significantFigures &&
  isEqual(convertToFundamentalUnits(context, entity), { EUR: 1 });

const formatCurrency = (context, formattingHints, entity) =>
  formatUnits(entity.quantity.toFixed(2), entity.units);

const baseNumberFormatter = (formattingHints, entity) => {
  const { base, decimalPlaces, significantFigures } = formattingHints;

  // if (entity.quantity === 1 && !noSymbols(entity)) {
  //   return '';
  // } else
  if (base !== undefined) {
    const prefix = getOr(`(base ${base}) `, base, baseNames);
    return `${prefix}${entity.quantity.toString(base)}`;
  } else if (decimalPlaces !== undefined) {
    return entity.quantity.toFixed(decimalPlaces);
  }

  const absValue = Math.abs(entity.quantity);

  if (significantFigures !== undefined) {
    return (absValue !== 0)
      ? entity.quantity.toFixed(significantFigures - orderOfMagnitude(absValue))
      : '0';
  } else if (absValue > 1E2 || absValue === 0) {
    return entity.quantity.toFixed(0);
  } else if (absValue > 1E-6) {
    // Note bigger than zero, so no log 0
    const magnitude = orderOfMagnitude(absValue);

    if (absValue - Math.floor(absValue) < (10 ** magnitude) * 1E-3) {
      // Last three numbers zero. i.e. 1,234,000
      // Don't show decimal place
      return entity.quantity.toFixed(0);
    }
    // Show two significant figures
    return entity.quantity.toFixed(2 - magnitude);
  }
  return entity.quantity.toExponential(3);
};

const baseFormatter = (context, formattingHints, entity) =>
  formatUnits(baseNumberFormatter(formattingHints, entity), entity.units);

const entityFormatter: (
  context: ResolverContext,
  formattingHints: FormattingHints,
  entity: EntityNode,
) => string = cond([
  [isCurrency, formatCurrency],
  [stubTrue, baseFormatter],
]);
export default entityFormatter;
