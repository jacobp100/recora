/* eslint-disable flowtype/require-valid-file-annotation */
import test from 'ava';
import { get, assignWith } from 'lodash/fp';
import Color from 'color-forge';
import Recora from '../src';

const recora = new Recora();
const defaultDate = recora.resolverContext.date;
const assignDefaults = assignWith((a, b) => (b === null ? a : b), defaultDate);

const parse = input => {
  try {
    return recora.parse(input);
  } catch (e) {
    console.log(e); // eslint-disable-line
    throw new Error(`Failed to parse "${input}`);
  }
};

const entityResult = (t, input, expectedQuantity, expectedUnits = {}) => {
  t.plan(3);

  const actual = parse(input);

  t.truthy(actual, `Expected to get a result for "${input}"`);

  const actualQuantity = get(['result', 'quantity'], actual);
  t.is(
    actualQuantity.toFixed(2),
    expectedQuantity.toFixed(2),
    `Expected ${actualQuantity} to equal ${expectedQuantity} for "${input}"`
  );

  const actualUnits = get(['result', 'units'], actual);
  t.deepEqual(
    actualUnits,
    expectedUnits,
    `Expected ${
      JSON.stringify(actualUnits)
    } to equal ${
      JSON.stringify(expectedUnits)
    } for "${input}"`
  );
};

const compositeEntityResult = (t, input, expectedResults) => {
  t.plan(2 + (expectedResults.length * 2));

  const actual = parse(input);

  t.truthy(actual, `Expected to get a result for "${input}"`);
  const entities = get(['result', 'value'], actual);

  t.is(entities.length, expectedResults.length);

  expectedResults.forEach(([expectedQuantity, expectedUnits], index) => {
    const { quantity: actualQuantity, units: actualUnits } = entities[index];

    t.is(
      actualQuantity.toFixed(2),
      expectedQuantity.toFixed(2),
      `Expected ${actualQuantity} to equal ${expectedQuantity} for "${input}"`
    );

    t.deepEqual(
      actualUnits,
      expectedUnits,
      `Expected ${
        JSON.stringify(actualUnits)
      } to equal ${
        JSON.stringify(expectedUnits)
      } for "${input}"`
    );
  }, expectedResults);
};

const colorResult = (t, input, expectedHex) => {
  t.plan(3);

  const actual = parse(input);
  t.truthy(actual, `Expected to get a result for "${input}"`);

  const { values: actualValues, alpha: actualAlpha, space } = actual.result;
  const { values: expectedValues, alpha: expectedAlpha } = Color.hex(expectedHex).convert(space);

  t.deepEqual(
    actualValues.map(value => value.toFixed(0)),
    expectedValues.map(value => value.toFixed(0)),
    `Expected values ${actualValues} to equal ${expectedValues} for "${input}"`
  );
  t.is(
    actualAlpha,
    expectedAlpha,
    `Expected alpha ${actualAlpha} to equal ${expectedAlpha} for "${input}"`
  );
};

const dateResult = (t, input, expectedValuesWithoutDefaults) => {
  t.plan(2);

  const actual = parse(input);
  const actualValuesWithoutDefaults = actual && actual.result.value;

  t.truthy(actualValuesWithoutDefaults, `Expected to get a result for "${input}"`);

  const actualValues = assignDefaults(actualValuesWithoutDefaults);
  const expectedValues = assignDefaults(expectedValuesWithoutDefaults);

  t.deepEqual(
    actualValues,
    expectedValues,
    `Expected ${
      JSON.stringify(actualValues)
    } to equal ${
      JSON.stringify(expectedValues)
    } for "${input}"`
  );
};

const stringResult = (t, input, expected) => {
  t.plan(1);
  const actual = parse(input).pretty;
  t.is(actual, expected);
};

// const noResult = (t, input) => {
//   t.plan(1);
//   const actual = parse(input);
//   t.is(actual, null);
// };

/* eslint-disable max-len */
test('basic maths', entityResult, '5', 5);
test('basic maths', entityResult, '100', 100);
test('basic maths', entityResult, '-3', -3);
test('basic maths', entityResult, '1 + 2', 3);
test('basic maths', entityResult, '5 - 2', 3);
test('basic maths', entityResult, '3 * 3', 9);
test('basic maths', entityResult, '9 / 3', 3);
test('basic maths', entityResult, '3 * -3', -9);
test('basic maths', entityResult, '3 ** 2', 9);
test('basic maths', entityResult, '3 ^ 2', 9);
test('basic maths', entityResult, '1.5 + 2.77', 4.27);
test('basic maths', entityResult, '1.5 * 1.77', 2.66);
test('basic maths', entityResult, '7 / 2.4', 2.92);
test('basic maths', entityResult, '2 * 1 + 1', 3);
test('basic maths', entityResult, '2 * 1 - 1', 1);
test('basic maths', entityResult, '1 + 1 * 2', 3);
test('basic maths', entityResult, '1 - 1 * 2', -1);
test('basic maths', entityResult, '1 + 4 / 2', 3);
test('basic maths', entityResult, '3 + -1', 2);
test('basic maths', entityResult, '3 + - 1', 2);
test('awkward expressions', entityResult, '-------4', -4);
test('awkward expressions', entityResult, '1------1', 2);
test('exponentiation', entityResult, '4 ** 3 ** 2', 262144);
test('exponentiation with negation', entityResult, '4 ** 3 ** -2', 1.17);
test('exponentiation with negation', entityResult, '4 ** -3 ** -2', 0.857);
test('exponentiation with negation', entityResult, '4 ** -3 ** 2', 0.00000381);
test('exponentiation with negation', entityResult, '-4 ** -3 ** 2', -0.00000381);
test('exponentiation with negation', entityResult, '-4 ** 3 ** 2', -262144);
test('factorial', entityResult, '5!', 120);
test('factorial', entityResult, '4.5!', 52.34);
test('factorial', entityResult, '4!', 24);
test('brackets', entityResult, '(1 + 1) * 2', 4);
test('brackets', entityResult, '1 + (2 * 2)', 5);
test('brackets', entityResult, '(1 + 1)', 2);
test('brackets', entityResult, '(6 - (2 + 2)) * 2', 4);
test('brackets', entityResult, '(6 - (2 + 2)) * (6 - (2 + 2))', 4);
test('functions', entityResult, 'negate(1)', -1);
test('functions', entityResult, 'add(1, 1)', 2);
test('functions', entityResult, 'sqrt(16) + sqrt(4)', 6);
test('functions', entityResult, 'sin(1)', 0.84);
test('functions', entityResult, 'sin(1 + 1)', 0.91);
test('functions', entityResult, 'sin(35 degrees)', 0.57);
test('functions', entityResult, '2 sin(30 degrees)', 1.00);
test('functions', entityResult, 'sqrt(4)', 2);
test('functions', entityResult, '-sqrt(4)', -2);
test('functions', entityResult, 'sin(1)', 0.84);
test('functions', entityResult, 'sqrt(2 + 2)', 2);
test('function shorthand', entityResult, 'sin 35 degrees', 0.57);
test('function shorthand', entityResult, '2 sin 30 degrees', 1.00);
test('function shorthand', entityResult, 'sqrt 4', 2);
test('function shorthand', entityResult, '-sqrt 4', -2);
test('function shorthand', entityResult, 'sqrt 4 + 1', 3);
// test('function shorthand', entityResult, 'sqrt^2(4)', 4);
test('function shorthand', entityResult, 'sqrt sqrt 16', 2);
test('function shorthand', entityResult, 'sin -1', -0.84);
test('function shorthand', entityResult, 'sin 3!', -0.28);
test('units', entityResult, '1 meter', 1, { meter: 1 });
test('units', entityResult, '1 METER', 1, { meter: 1 });
test('units', entityResult, '2 meters', 2, { meter: 1 });
test('units', entityResult, '1 yard', 1, { yard: 1 });
test('units', entityResult, '2 yards', 2, { yard: 1 });
test('units', entityResult, '1 meter^2', 1, { meter: 2 });
test('units', entityResult, '1 meter second^-2', 1, { meter: 1, second: -2 });
test('units', entityResult, 'GBP 1', 1, { GBP: 1 });
test('units', entityResult, '1 GBP', 1, { GBP: 1 });
test('units', entityResult, '2000 kibibits to mebibits', 1.95, { mebibit: 1 });
test('units', entityResult, '2000 kilobytes to megabytes', 2, { megabyte: 1 });
test('units', entityResult, '2 mebibytes to kibibytes', 2048, { kibibyte: 1 });
test('units', entityResult, '2000 kibibytes to mebibytes', 1.95, { mebibyte: 1 });
test('unit shorthands', entityResult, '1 m', 1, { meter: 1 });
test('unit shorthands', entityResult, '1 m s^-2', 1, { meter: 1, second: -2 });
test('unit shorthands', entityResult, '£1.00', 1, { GBP: 1 });
test('conversion', entityResult, '1 meter to yards', 1.09, { yard: 1 });
test('conversion', entityResult, '1 minute to seconds', 60, { second: 1 });
test('conversion', entityResult, '3 feet 4 inches to cm', 101.6, { centimeter: 1 });
test('conversion', entityResult, '3 feet 4 inches to centimetres', 101.6, { centimeter: 1 });
test('conversion', entityResult, '1 gallon to meters^3', 0.00455, { meter: 3 });
test('conversion', entityResult, '1 gigajoules to kilowatt hours', 277.78, { kilowatt: 1, hour: 1 });
test('conversion', entityResult, '1 joule per second to watts', 1, { Watt: 1 });
test('conversion', entityResult, '1km to meters', 1000, { meter: 1 });
test('unit operations', entityResult, '1 meter + 1 yard to centimeters', 191.44, { centimeter: 1 });
test('unit operations', entityResult, 'kilometers in 1 mile', 1.61, { kilometer: 1 });
test('unit operations', entityResult, 'ounces in 1kg', 35.27, { ounce: 1 });
test('unit operations', entityResult, '1 meter + 1 yard', 1.91, { meter: 1 });
test('unit operations', entityResult, '1kg - 1 ounce', 0.97, { kilogram: 1 });
test('unit operations', entityResult, '180 degrees + 3.14 radians', 359.91, { degree: 1 });
test('unit operations', entityResult, '3.14 radians + 180 degrees', 6.28, { radian: 1 });
test('mixed dimension conversions', entityResult, '1 acre to square meters', 4047, { meter: 2 });
test('mixed dimension conversions', entityResult, '1 acre to meters squared', 4047, { meter: 2 });
test('multiple word units', entityResult, '1 pounds sterling to us dollars', 1.00, { USD: 1 });
test('multiple word units', entityResult, '1 canadian dollars to korean won', 1.00, { KRW: 1 });
test('multiple word units', entityResult, '1 american dollars to swiss francs', 1.00, { CHF: 1 });
test('multiple word units', entityResult, '1 brazilian real to hong kong dollars', 1.00, { HKD: 1 });
test('multiple word units', entityResult, '1 Hungarian forint to Chinese yuan', 1.00, { CNY: 1 });
test('multiple word units', entityResult, '1 forint to Chinese yuan', 1.00, { CNY: 1 });
test('multiple word units', entityResult, '1 us dollar to mexican peso', 1.00, { MXN: 1 });
test('multiple word units', entityResult, '1 mexican peso to euro', 1.00, { EUR: 1 });
test('multiple word units', entityResult, '1000 us cup to fluid ounces', 8291.63, { 'fluid ounce': 1 });
test('unit operator ambiguity', entityResult, '5 meters per second to kilometers per hour', 18, { kilometer: 1, hour: -1 });
test('unit operator ambiguity', entityResult, '5 meters / second to kilometers / hour', 18, { kilometer: 1, hour: -1 });
test('unit operator ambiguity', entityResult, '5 meters per second to kilometers / hour', 18, { kilometer: 1, hour: -1 });
test('unit operator ambiguity', entityResult, '5 meters / second to kilometers per hour', 18, { kilometer: 1, hour: -1 });
test('natural language', entityResult, '5 kilos at £1/kg', 5.00, { GBP: 1 });
test('natural language', entityResult, '£5 using £1/kg', 5, { kilogram: 1 });
test('natural language', entityResult, 'mortgage is -£10 per month', -10, { GBP: 1, month: -1 });
test('natural language', entityResult, 'Convert 1 meter to yards please', 1.09, { yard: 1 });
test('natural language', entityResult, 'How many yards are there in 100 meters?', 109.36, { yard: 1 });
test('natural language', entityResult, 'How many ounces can I buy with £5 at $1/kg', 176.37, { ounce: 1 });
test('natural language', entityResult, '70km using 35 miles per gallon', 1.24, { gallon: 1 });
test('natural language', entityResult, '70km using 35 miles per gallon at £1.20 per liter', 6.78, { GBP: 1 });
test('temperature conversions', entityResult, '100 celsius to kelvin', 373.15, { Kelvin: 1 });
test('temperature conversions', entityResult, '180 celsius to fahrenheit', 356, { Fahrenheit: 1 });
test('temperature conversions', entityResult, '180 centigrade to celsius', 180, { Celsius: 1 });
test('temperature conversions', entityResult, 'gas mark 4 to celsius', 180, { Celsius: 1 });
test('temperature conversions', entityResult, '4 gas mark to celsius', 180, { Celsius: 1 });
// test('temperature conversions', entityResult, '180 degrees centigrade to gas mark', 4, { 'gas mark': 1 });
test('composite conversions', compositeEntityResult, '1 meter to feet and inches', [[3, { foot: 1 }], [3, { inch: 1 }]]);
test('composite conversions', compositeEntityResult, '500m to yards, feet and inches', [[546, { yard: 1 }], [2, { foot: 1 }], [5, { inch: 1 }]]);
test('composite conversions', compositeEntityResult, '2gb at 50kb/s to hours, minutes and seconds', [[11, { hour: 1 }], [6, { minute: 1 }], [40, { second: 1 }]]);
test('composite conversions', compositeEntityResult, '1 yard to feet and inches', [[3, { foot: 1 }], [0, { inch: 1 }]]);
test('formatting hints', stringResult, '500 to base 7', '(base 7) 1313');
test('formatting hints', stringResult, '500 to base 10', '500');
test('formatting hints', stringResult, '500 to binary', '0b111110100');
test('formatting hints', stringResult, '500 to octal', '0o764');
test('formatting hints', stringResult, '500 to hexadecimal', '0x1f4');
test('formatting hints', stringResult, '#800000 to hsl', 'hsl(0, 100%, 25%)');
test('formatting hints', stringResult, '#123456 to hsl', 'hsl(210, 65%, 20%)');
test('formatting hints', stringResult, 'hsl(210 degrees, 65%, 20%) to rgb', 'rgb(18, 51, 84)');
test('formatting hints', stringResult, 'rgb(18, 51, 84) to hsl', 'hsl(210, 65%, 20%)');
test('formatting hints', stringResult, 'hsl(0, 100%, 50%) to hsl', 'hsl(0, 100%, 50%)');
// test('fix sin pi', entityResult, 'sin(pi)', 0);
// test('resolve constant', entityResult, 'pi', 3.14);
// test('resolve constant', entityResult, 'e', 2.72);
// test('resolve constant', entityResult, '2pi', 6.28);
// test('resolve constant', entityResult, '2e^2', 14.8);
// test('resolve constant', entityResult, '0pi', 0);
test('pergentages', entityResult, '10 + 10%', 11);
test('pergentages', entityResult, '10 - 10%', 9);
test('pergentages', entityResult, '10 * 10%', 1);
test('pergentages', entityResult, '10 / 10%', 100);
test('pergentages', entityResult, '10% * 10', 1);
test('pergentages', entityResult, '10 meters + 10%', 11, { meter: 1 });
test('pergentages', entityResult, '10 meters - 10%', 9, { meter: 1 });
test('pergentages', entityResult, '120% of 10 meters', 12, { meter: 1 });
// { 'description': 'solve', entityResult, '2x - 5 = 0', x = 5 / 2 or 2.500000);
// { 'description': 'solve', entityResult, '2x = 5', x = 5 / 2 or 2.500000);
// { 'description': 'solve', entityResult, 'x^2 + 2x - 1 = 0', x = 0.414214; x = -2.414214);
// { 'description': 'solve', entityResult, '2test = 5', test = 5 / 2 or 2.500000);
// { 'description': 'solve', entityResult, 'testing^2 + 2testing - 1 = 0', testing = 0.414214; testing = -2.414214);
// { 'description': 'solve', entityResult, 'hello^2 = 16', hello = 4.000000; hello = -4.000000);
// { 'description': 'solve', entityResult, 'x^5 + 2x = 8', x = 1.391503);
// { 'description': 'solve', entityResult, 'sin(x) + cos(x) = 0', x = 5.497787);
// { 'description': 'solve', entityResult, 'sin(x) + cos(x) - x^2 = 0', x = 1.149555);
// { 'description': 'solve', entityResult, '2a = 5', a = 5 / 2 or 2.500000);
// test('test', entityResult, 'meters in a kilometer', 1,000 meters);
// test('test', entityResult, '1000 meters a in kilometer', 1 kilometer);
// test('test', entityResult, '20cm by 20cm', 400 centimeters²);
// test('test', entityResult, '20cm by 20cm by 20cm', 8000 centimeters³);
// test('test', entityResult, '1992/12/4', Fri Dec 04 1992 00:00:00 GMT+0000);
test('date parsing', dateResult, '5th jan 2015', { date: 5, month: 1, year: 2015 });
test('date parsing', dateResult, '5 jan 2015', { date: 5, month: 1, year: 2015 });
test('date parsing', dateResult, '6pm 5th jan 2015', { hour: 18, date: 5, month: 1, year: 2015 });
test('date parsing', dateResult, '6:53am 5th jan 2015', { minute: 53, hour: 6, date: 5, month: 1, year: 2015 });
test('date parsing', dateResult, '6:07am 5th jan 2015', { minute: 7, hour: 6, date: 5, month: 1, year: 2015 });
test('date parsing', dateResult, '1992-12-04T10:09:08.7654Z', { date: 4, month: 12, year: 1992, hour: 10, minute: 9, second: 8 });
test('date entity math', dateResult, '1992-12-04 + 30 days', { date: 3, month: 1, year: 1993 });
test('date entity math', dateResult, '1992-12-04 + 1 year', { date: 4, month: 12, year: 1993 });
test('date entity math', dateResult, '1992-12-04 - 1 century', { date: 4, month: 12, year: 1892 });
test('date math', entityResult, '1992-12-04 until 1993-06-18', 196.04, { day: 1 });
test('relative dates', dateResult, 'now', { date: 1, month: 1, year: 1970 });
test('relative dates', dateResult, 'tomorrow', { date: 2, month: 1, year: 1970 });
test('relative dates', dateResult, 'yesterday', { date: 31, month: 12, year: 1969 });
test('relative dates', dateResult, 'next week', { date: 8, month: 1, year: 1970 });
test('relative dates', dateResult, 'last week', { date: 25, month: 12, year: 1969 });
// We may need to special case additions: i.e. (date) + 1 month should increment the month,
// not add ~30.5 days
test('relative dates', dateResult, 'next month', { hour: 10, date: 31, month: 1, year: 1970 });
test('relative dates', dateResult, 'last month', { hour: 14, date: 1, month: 12, year: 1969 });
test('relative dates', dateResult, 'next year', { date: 1, month: 1, year: 1971 });
test('relative dates', dateResult, 'last year', { date: 1, month: 1, year: 1969 });
test('relative date math', dateResult, '2 weeks + now', { date: 15, month: 1, year: 1970 });
test('relative date math', dateResult, 'now + 2 weeks', { date: 15, month: 1, year: 1970 });
test('relative date math', dateResult, 'now - 2 weeks', { date: 18, month: 12, year: 1969 });
test('relative date math', dateResult, '2 weeks from now', { date: 15, month: 1, year: 1970 });
test('relative date math', dateResult, '2 weeks ago', { date: 18, month: 12, year: 1969 });
test('relative date math', dateResult, '13 hours from now', { hour: 13, date: 1, month: 1, year: 1970 });
// test('relative date math', dateResult, '2 weeks ago until next week in days', 21 days);
// test('relative dates', 'next week to days', 7 days);
// test('should not crash with', entityResult, 'sin', );
// test('should not crash with', entityResult, 'sin(', );
// test('should not crash with', entityResult, 'sin(2 * )', );
// test('should not crash with', entityResult, '1 *', );
test('parse colours', colorResult, '#f00', '#ff0000');
test('colour constructors', colorResult, 'rgb(128, 0, 0)', '#800000');
test('colour constructors', colorResult, 'rgb(50%, 0%, 0%)', '#800000');
test('colour constructors', colorResult, 'hsl(0, 0, 100%)', '#ffffff');
test('colour constructors', colorResult, 'hsl(0, 100%, 50%)', '#ff0000');
test('colour constructors', colorResult, 'hsl(0, 0, 0)', '#000000');
test('colour constructors', colorResult, 'hsl(180 degrees, 100, 50)', '#00ffff');
test('colour constructors', colorResult, 'hsl(210 degrees, 65%, 20%)', '#123354');
test('operators on colors', colorResult, '#f00 + #0f0', '#ffff00');
test('operators on colors', colorResult, '#f00 + #f00', '#ff0000');
test('operators on colors', colorResult, '#f00 - #800', '#770000');
test('operators on colors', colorResult, '#700 + #800', '#ff0000');
test('operators on colors', colorResult, '#888 * #888', '#494949');
test('operators on', colorResult, '#800 * #880', '#490000');
test('operators on', colorResult, '#800 / #880', '#ff0000');
test('operators on colors', colorResult, '#888 / #888', '#ffffff');
test('operators on colors', colorResult, '#888 / #fff', '#888888');
test('operators on colors and entities', colorResult, '#800 * 2', '#ff0000');
test('operators on colors and entities', colorResult, '#f00 / 2', '#800000');
test('operators on colors and entities', colorResult, '2 * #800', '#ff0000');
test('operators on colors and entities', colorResult, '#888 ** 2', '#494949');
test('operators on colors and percentages', colorResult, '#800 + 20%', '#ee0000');
test('operators on colors and percentages', colorResult, '#800 - 20%', '#220000');
test('operators on colors and percentages', colorResult, 'darken(#FF0000, 25%)', '#800000');
test('operators on colors and percentages', colorResult, 'lighten(#800000, 50%)', '#ff8080');
test('operators on colors and percentages', colorResult, 'screen(#123456, #345678)', '#4278a6');
test('operators on colors and percentages', colorResult, 'overlay(#123456, #345678)', '#072351');
test('operators on colors and percentages', colorResult, 'dodge(#123456, #345678)', '#386cb5');
test('operators on colors and percentages', colorResult, 'burn(#ccc, #ccc)', '#bfbfbf');
test('colour functions', colorResult, 'mix(#800000, #ff0000)', '#c00000');
test('colour functions', colorResult, 'mix(#800000, #ff0000, 30%)', '#a60000');
test('colour functions', colorResult, 'mix(#800000, #ff0000, 0.3)', '#a60000');
test('colour functions', colorResult, 'darken(rgb(255, 0, 0), 50%)', '#000000');
test('colour functions', colorResult, 'darken(hsl(0, 100%, 100), 50%)', '#ff0000');
test('colour functions', colorResult, 'darken(hsl(0, 100%, 50%), 25%)', '#800000');
// test('test', colorResult, 'red', #ff0000);
// test('test', colorResult, 'red + lime', #ffff0);
/* eslint-enable */
