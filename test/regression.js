/* eslint-disable flowtype/require-valid-file-annotation */
import test from 'ava';
import { get, forEach, getOr } from 'lodash/fp';
import Color from 'color-forge';
import Recora from '../src';

const recora = new Recora();

const entityResult = (t, input, expectedQuantity, expectedUnits = {}) => {
  t.plan(3);
  const actual = recora.parse(input);

  t.truthy(actual, `Expected to get a result for "${input}"`);

  const quantity = get(['result', 'quantity'], actual);
  t.true(
    quantity.toFixed(2) === expectedQuantity.toFixed(2),
    `Expected ${quantity} to equal ${expectedQuantity} for "${input}"`
  );

  const units = get(['result', 'units'], actual);
  t.deepEqual(
    expectedUnits,
    units,
    `Expected ${JSON.stringify(units)} to equal ${JSON.stringify(expectedUnits)} for "${input}"`
  );
};

const colorResult = (t, input, expectedHex) => {
  t.plan(3);

  const actual = recora.parse(input);
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

const dateResult = (t, input, expectedValues) => {
  const dateKeys = ['second', 'minute', 'hour', 'date', 'month', 'year'];
  t.plan(1 + dateKeys.length);

  const actual = recora.parse(input);
  t.truthy(actual, `Expected to get a result for "${input}"`);

  const actualValues = actual.result.value;

  forEach(dateKey => {
    const actualValue = actualValues[dateKey];
    const expectedValue = getOr(null, dateKey, expectedValues);

    t.is(
      actualValue,
      expectedValue,
      `Expected ${dateKey} of ${actualValue} to equal ${expectedValue} for "${input}"`
    );
  }, dateKeys);
};

// const noResult = (t, input) => {
//   t.plan(1);
//   const actual = recora.parse(input);
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
test('brackets', entityResult, '(1 + 1) * 2', 4);
test('brackets', entityResult, '1 + (2 * 2)', 5);
test('brackets', entityResult, '(1 + 1)', 2);
test('conversion', entityResult, '1 meter to yards', 1.09, { yard: 1 });
test('conversion', entityResult, '1 minute to seconds', 60, { second: 1 });
test('conversion', entityResult, '3 feet 4 inches to cm', 101.6, { centimeter: 1 });
test('conversion', entityResult, '1 meter + 1 yard to centimeters', 191.44, { centimeter: 1 });
test('conversion', entityResult, 'kilometers in 1 mile', 1.61, { kilometer: 1 });
test('conversion', entityResult, 'ounces in 1kg', 35.27, { ounce: 1 });
test('conversion', entityResult, '1 meter + 1 yard', 1.91, { meter: 1 });
test('conversion', entityResult, '1kg - 1 ounce', 0.97, { kilogram: 1 });
// test('does not add', noResult, '1 meter + 1');
// test('test', entityResult, '100 celsius to kelvin', 373, { Kelvin: 1 });
// test('test', entityResult, '180 celsius to fahrenheit', 356, { Fahrenheit: 1 });
// test('test', entityResult, '180 centigrade to celsius', 180, { Celsius: 1 });
// test('test', entityResult, 'gas mark 4 to celsius', 180, { Celsius: 1 });
// test('test', entityResult, '4 gas mark to celsius', 180, { Celsius: 1 });
// test('test', entityResult, '180 degrees centigrade to gas mark', 4, { 'gas mark': 1 });
// test('test', entityResult, '3 feet 4 inches to centimetres', 102, { centimeters: 1 });
// test('test', entityResult, '5!', 120);
// test('test', entityResult, '4.5!', 52.3);
// test('test', entityResult, '4!', 24);
// test('test', entityResult, '180 degrees + 3.14 radians', 6.28);
// test('test', entityResult, '5 kilos at £1/kg', 5.00, { GBP: 1 });
// test('test', entityResult, '£5 using £1/kg', 5, { kilograms: 1 });
// test('test', entityResult, '70km using 35 miles per gallon', 5.65, { liters: 1 });
// test('test', entityResult, '70km using 35 miles per gallon at £1.20 per liter', 6.78, { GBP: 1 });
// test('test', entityResult, '1 meter to feet and inches', 3 feet 3 inches);
// test('test', entityResult, '500m to yards, feet and inches', 546 yards 2 feet 5 inches);
// test('test', entityResult, '1 gallon to meters^3', 0.00455, { meters: 3 });
// test('test', entityResult, '1 gigajoules to kilowatt hours', 278, { kilowatt: 1, hour: 1 });
// test('test', entityResult, '1 joule per second to watts', 1, { Watt: 1 });
// test('test', entityResult, '2 * (1 + 1)', 4);
// test('test', entityResult, 'sin(1)', 0.841);
// test('test', entityResult, 'sin(1 + 1)', 0.909);
// test('test', entityResult, 'sin(35 degrees)', 0.574);
// test('test', entityResult, '2 sin(30 degrees)', 1.000);
// test('test', entityResult, 'sqrt(4)', 2);
// test('test', entityResult, '-sqrt(4)', -2);
// test('test', entityResult, 'sin(1)', 0.841);
// test('test', entityResult, 'sqrt(2 + 2)', 2);
// test('accept shorthand', entityResult, 'sin 35 degrees', 0.574);
// test('accept shorthand', entityResult, '2 sin 30 degrees', 1.000);
// test('accept shorthand', entityResult, 'sqrt 4', 2);
// test('accept shorthand', entityResult, '-sqrt 4', -2);
// test('accept shorthand', entityResult, 'sqrt 4 + 1', 3);
// test('accept shorthand', entityResult, 'sqrt^2(4)', 4);
// test('accept shorthand', entityResult, 'sqrt sqrt 16', 2);
// test('accept shorthand', entityResult, 'sin -1', -0.841);
// test('accept shorthand', entityResult, 'sin 3!', -0.279);
// test('test', entityResult, 'sqrt(16) + sqrt(4)', 6);
// test('test', entityResult, '2gb at 50kb/s to hours, minutes and seconds', 11 hours 6 minutes 40 seconds);
// test('test', entityResult, '1 yard to feet and inches', 3 feet 0 inches);
// test('test', entityResult, '2000 kibibits to mebibits', 1.95, { mebibits: 1 });
// test('test', entityResult, '2000 kilobytes to megabytes', 2, { megabytes: 1 });
// test('test', entityResult, '2 mebibytes to kibibytes', 2048, { kibibytes: 1 });
// test('test', entityResult, '2000 kibibytes to mebibytes', 1.95, { mebibytes: 1 });
// { 'description': 'pretty print', entityResult, '1 / 4', 1 / 4 or 0.250);
// { 'description': 'pretty print', entityResult, '2 / 4', 1 / 2 or 0.500);
// { 'description': 'pretty print', entityResult, '3 / 4', 3 / 4 or 0.750);
// { 'description': 'pretty print', entityResult, '1 / 5', 1 / 5 or 0.200);
// { 'description': 'pretty print', entityResult, '2 / 5', 2 / 5 or 0.400);
// { 'description': 'pretty print', entityResult, '3 / 5', 3 / 5 or 0.600);
// { 'description': 'pretty print', entityResult, '4 / 5', 4 / 5 or 0.800);
// { 'input': 'sin(60 degrees)', √(3) / 2 or 0.866);
// test('test', entityResult, '500 to base 7', (base 7) 1313);
// test('test', entityResult, '500 to base 10', 500);
// test('test', entityResult, '500 to binary', 0b111110100);
// test('test', entityResult, '500 to octal', 0o764);
// test('test', entityResult, '500 to hexadecimal', 0x1f4);
// test('fix sin pi', entityResult, 'sin(pi)', 0);
// test('test', entityResult, '1km to meters', 1,000 meters);
// test('test', entityResult, '1 acre to square meters', 4,047 meters²);
// test('test', entityResult, '1 acre to meters squared', 4,047 meters²);
// test('resolve constant', entityResult, 'pi', 3.14);
// test('resolve constant', entityResult, 'e', 2.72);
// test('resolve constant', entityResult, '2pi', 6.28);
// test('resolve constant', entityResult, '2e^2', 14.8);
// test('resolve constant', entityResult, '0pi', 0);
// test('test', entityResult, '10 + 10%', 11);
// test('test', entityResult, '10 - 10%', 9);
// test('test', entityResult, '10 * 10%', 1);
// test('test', entityResult, '10 / 10%', 100);
// test('test', entityResult, '10 meters + 10%', 11 meters);
// test('test', entityResult, '10 meters - 10%', 9 meters);
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
// test('test', entityResult, '5 meters per second to kilometers per hour', 18 kilometers per hour);
// test('test', entityResult, '5 meters / second to kilometers / hour', 18 kilometers per hour);
// test('test', entityResult, '5 meters per second to kilometers / hour', 18 kilometers per hour);
// test('test', entityResult, '5 meters / second to kilometers per hour', 18 kilometers per hour);
// test('test', entityResult, '20cm by 20cm', 400 centimeters²);
// test('test', entityResult, '20cm by 20cm by 20cm', 8000 centimeters³);
// test('test', entityResult, '1 foot 5 inches', 0.432 meters);
// test('test', entityResult, '1 pounds sterling to us dollars', $1.00);
// test('test', entityResult, '1 canadian dollars to korean won', 1.00 KRW);
// test('test', entityResult, '1 american dollars to swiss francs', 1.00 CHF);
// test('test', entityResult, '1 brazilian real to hong kong dollars', 1.00 HKD);
// test('test', entityResult, '1 Hungarian forint to Chinese yuan', 1.00 CNY);
// test('test', entityResult, '1 forint to Chinese yuan', 1.00 CNY);
// test('test', entityResult, '1 us dollar to mexican peso', 1.00 MXN);
// test('test', entityResult, '1 mexican peso to euro', 1.00€);
// test('test', entityResult, '1000 us cup to fluid ounces', 8,292 fluid ounces);
// test('test', entityResult, '1992/12/4', Fri Dec 04 1992 00:00:00 GMT+0000);
// test('test', entityResult, '1992/12/4 + 30 days', Sun Jan 03 1993 00:00:00 GMT+0000);
// test('test', entityResult, '1992/12/4 + 1 year', Sat Dec 04 1993 00:00:00 GMT+0000);
// test('test', entityResult, '1992/12/4 - 1 century', Sun Dec 04 1892 00:00:00 GMT+0000);
// test('test', entityResult, '1992/12/4 until 1993/6/18', 196 days);
// { 'input': 'next week', Midnight Thursday, 8th January 1970);
// { 'input': 'last week', Midnight Thursday, 25th December 1969);
// { 'input': 'next week to days', 7 days);
// { 'input': 'now', Midnight Thursday, 1st January 1970);
// { 'input': '2 weeks + now', Thursday, 15th January 1970);
// { 'input': '2 weeks from now', Thursday, 15th January 1970);
// { 'input': '2 weeks ago', Thursday, 18th December 1969);
// { 'input': '2 weeks ago until next week in days', 21 days);
// { 'input': '13 hours from now', 1:00PM, Thursday, 1st January 1970);
test('date parsing', dateResult, '5th jan 2015', { date: 5, month: 0, year: 2015 });
test('date parsing', dateResult, '5 jan 2015', { date: 5, month: 0, year: 2015 });
test('date parsing', dateResult, '6pm 5th jan 2015', { hour: 18, date: 5, month: 0, year: 2015 });
test('date parsing', dateResult, '6:53am 5th jan 2015', { minute: 53, hour: 6, date: 5, month: 0, year: 2015 });
test('date parsing', dateResult, '6:07am 5th jan 2015', { minute: 7, hour: 6, date: 5, month: 0, year: 2015 });
// test('test', entityResult, 'mortgage is -£10 per month', £-10.00 per month);
// test('test', entityResult, 'Convert 1 meter to yards please', 1.09 yards);
// test('test', entityResult, 'How many yards are there in 100 meters?', 109 yards);
// test('test', entityResult, 'How many ounces can I buy with £5 at $1/kg', 176 ounces);
// test('should not crash with', entityResult, 'sin', );
// test('should not crash with', entityResult, 'sin(', );
// test('should not crash with', entityResult, 'sin(2 * )', );
// test('should not crash with', entityResult, '1 *', );
test('parse colours', colorResult, '#f00', '#ff0000');
// test('test', colorResult, 'rgb(128, 0, 0)', #800000);
// test('test', colorResult, 'hsl(0, 100%, 1)', #ffffff);
// test('test', colorResult, 'hsl(0, 100%, 0.5)', #ff0000);
// test('test', colorResult, 'hsl(0, 1, 0)', #000000);
// test('test', colorResult, 'hsl(180 degrees, 1, 0.5)', #00ffff);
// test('test', colorResult, 'hsl(50%, 1, 0.5)', #00ffff);
// test('test', colorResult, 'hsl(0, 0, 0.5)', #808080);
// test('test', colorResult, 'hsl(210 degrees, 65%, 20%)', #123354);
// test('test', colorResult, '#800000 to hsl', hsl(0°, 100%, 25%));
// test('test', colorResult, '#123456 to hsl', hsl(210°, 65%, 20%));
// test('test', colorResult, 'hsl(210 degrees, 65%, 20%) to rgb', rgb(18, 51, 84));
// test('test', colorResult, 'rgb(18, 51, 84) to hsl', hsl(210°, 65%, 20%));
// test('test', colorResult, 'hsl(0, 100%, 0.5) to hsl', hsl(0°, 100%, 50%));
test('operators on colors', colorResult, '#f00 + #0f0', '#ffff00');
test('operators on colors', colorResult, '#f00 + #f00', '#ff0000');
test('operators on colors', colorResult, '#f00 - #800', '#770000');
test('operators on colors', colorResult, '#700 + #800', '#ff0000');
test('operators on colors', colorResult, '#888 * #888', '#494949');
test('operators on colors', colorResult, '#888 / #888', '#ffffff');
test('operators on colors', colorResult, '#888 / #fff', '#888888');
// test('test', colorResult, '#888 ** 2', #494949);
// test('test', colorResult, 'darken(#FF0000, 25%)', #800000);
// test('test', colorResult, 'lighten(#800000, 50%)', #ff8080);
// test('test', colorResult, 'darken(rgb(255, 0, 0), 50%)', #000000);
// test('test', colorResult, 'darken(hsl(0, 100%, 1), 50%)', #ff0000);
// test('test', colorResult, 'darken(hsl(0, 100%, 0.5), 50%)', #000000);
// test('test', colorResult, 'mix(#800000, #ff0000)', #c00000);
// test('test', colorResult, 'mix(#800000, #ff0000, 30%)', #a60000);
// test('test', colorResult, 'screen(#123456, #345678)', #4278a6);
// test('test', colorResult, 'overlay(#123456, #345678)', #072351);
// test('test', colorResult, 'dodge(#123456, #345678)', #386cb5);
// test('test', colorResult, 'burn(#ccc, #ccc)', #bfbfbf);
// test('test', colorResult, '#800 * 2', #ff0000);
// test('test', colorResult, '#f00 / 2', #800000);
// test('test', colorResult, '#800 + 20%', #ee0000);
// test('test', colorResult, '#800 - 20%', #220000);
// test('test', colorResult, '#800 * #880', #490000);
// test('test', colorResult, '#800 / #880', #ff0000);
// test('test', colorResult, 'red', #ff0000);
// test('test', colorResult, 'red + lime', #ffff0);
/* eslint-enable */
