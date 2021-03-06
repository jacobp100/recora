// @flow
import { isEqual, toPairs, reduce, stubTrue, cond, getOr } from 'lodash/fp';
import type { EntityNode, ResolverContext } from '../../math/types';
import { getFundamentalUnits } from '../../math/types/entity';
import unitFormatting from '../data/en-unit-formatting.json';
import unitPlurals from '../data/en-unit-plurals.json';
import { formatPower, orderOfMagnitude } from '../util';


/* eslint-disable quote-props */
const baseNames = {
  '2': '0b',
  '8': '0o',
  '10': '',
  '16': '0x',
};
/* eslint-enable */

const formatUnits = (value, entity) => {
  const isPlural = entity.quantity !== 1;
  const formatPlural = isPlural
    ? unit => getOr(unit, unit, unitPlurals)
    : unit => unit;

  return reduce((value, [unit, power]) => {
    if (unit.power > 1) {
      return `${value} ${formatPlural(unit)}^${formatPower(power)}`;
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
    return `${value} ${formatPlural(unit)}`;
  }, value, toPairs(entity.units));
};

const isCurrency = (context, entity) =>
  !entity.formatting.base &&
  !entity.formatting.decimalPlaces &&
  !entity.formatting.significantFigures &&
  isEqual(getFundamentalUnits(context, entity.units), { EUR: 1 });

const formatCurrency = (context, entity) =>
  formatUnits(entity.quantity.toFixed(2), entity);

const baseNumberFormatter = (entity) => {
  const { base, decimalPlaces, significantFigures } = entity.formatting;

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

const baseFormatter = (context, entity) =>
  formatUnits(baseNumberFormatter(entity), entity);

const entityFormatter: (
  context: ResolverContext,
  entity: EntityNode,
) => string = cond([
  [isCurrency, formatCurrency],
  [stubTrue, baseFormatter],
]);
export default entityFormatter;
