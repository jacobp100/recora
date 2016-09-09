/* eslint-disable flowtype/require-valid-file-annotation */
import gulp from 'gulp';
import pluralize from 'pluralize';
import {
  flow, keys, map, fromPairs, toPairs, filter, reject, assign, mapKeys, curry, words,
} from 'lodash/fp';
import file from 'gulp-file';
import alternateSpellings from './gulp-data/alternate-spellings';
import abbreviations from './gulp-data/abbreviations';

const toLowerCase = string => string.toLowerCase();
const matchesRe = regexp => string => regexp.test(string);
const numberWordsEq = curry((number, word) => words(word).length === number);
const mirrorKeys = object => flow(
  keys,
  map(key => [key, key]),
  fromPairs
)(object);
const createKeysBy = baseFn => curry((fn, object) => flow(
  toPairs,
  baseFn(([key]) => fn(key)),
  fromPairs,
)(object));
const pickKeysBy = createKeysBy(filter);
const omitKeysBy = createKeysBy(reject);


const pluralizeLastWord = word => {
  const wordsArray = words(word);
  wordsArray[wordsArray.length - 1] = pluralize(wordsArray[wordsArray.length - 1]);
  return wordsArray.join(' ');
};

const getUnitsWithPlurals = units => {
  const unitsToPluralize = flow(
    omitKeysBy(matchesRe(/^[A-Z]+$/)),
    pickKeysBy(matchesRe(/^[a-z\s]+$/i))
  )(units);
  const pluralUnits = mapKeys(flow(pluralizeLastWord, toLowerCase), unitsToPluralize);
  const lowerCaseUnits = mapKeys(toLowerCase, units);

  return assign(lowerCaseUnits, pluralUnits);
};

gulp.task('data', () => {
  const unitDescriptors = require('./src/data/units').default; // eslint-disable-line
  const units = assign(mirrorKeys(unitDescriptors), alternateSpellings);
  const allUnits = getUnitsWithPlurals(units);

  const allAbbreviations = getUnitsWithPlurals(abbreviations);

  const oneWordUnits = pickKeysBy(numberWordsEq(1), allUnits);
  const twoWordUnits = pickKeysBy(numberWordsEq(2), allUnits);
  const threeWordUnits = pickKeysBy(numberWordsEq(3), allUnits);

  return file([
    { name: '1-word-units.json', source: JSON.stringify(oneWordUnits) },
    { name: '2-word-units.json', source: JSON.stringify(twoWordUnits) },
    { name: '3-word-units.json', source: JSON.stringify(threeWordUnits) },
    { name: 'abbreviations.json', source: JSON.stringify(allAbbreviations) },
  ])
    .pipe(gulp.dest('src/data/en'));
});
