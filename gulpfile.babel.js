/* eslint-disable flowtype/require-valid-file-annotation */
import gulp from 'gulp';
import path from 'path';
import webpack from 'webpack';
import del from 'del';
import pluralize from 'pluralize';
import {
  flow, keys, map, fromPairs, toPairs, filter, reject, mapValues, get, words, keyBy, concat, getOr,
  first, flatMap, groupBy, omitBy, isNil, flatten, without, values,
} from 'lodash/fp';
import file from 'gulp-file';
import units from './src/units';
import en from './gulp-data/en.json';


const enDataDir = 'data/en';
const enMathFormattingDataDir = 'src/modules/math-formatter/data';


const toLowerCase = string => string.toLowerCase();
const matchesRe = regexp => string => regexp.test(string);
const numberWords = word => words(word).length;
const pluralizeLastWord = word => {
  const wordsArray = words(word);
  wordsArray[wordsArray.length - 1] = pluralize(wordsArray[wordsArray.length - 1]);
  return wordsArray.join(' ');
};

const getUnitsWithPlurals = allUnits => {
  // If a plural word already exists, say we pluralise the abbreviation m to get ms
  // but ms is milliseconds, let the existing value take priority
  const pluralWordsToIgnore = flow(
    values,
    flatten,
    map(toLowerCase),
  )(allUnits);

  return mapValues(units => {
    const pluralUnits = flow(
      reject(matchesRe(/^[A-Z]+$/)),
      filter(matchesRe(/^[a-z\s]+$/i)),
      map(toLowerCase),
      map(pluralizeLastWord),
      without(pluralWordsToIgnore)
    )(units);
    const lowerCaseUnits = map(toLowerCase, units);

    return concat(lowerCaseUnits, pluralUnits);
  }, allUnits);
};

gulp.task('clean-en-data', () => del(enDataDir));

gulp.task('en-data', ['clean-en-data'], () => {
  const unitAlternateSpellings = flow(
    keys,
    map(unit => concat([unit], getOr([], [unit, 'alternates'], en))),
    keyBy(first),
    getUnitsWithPlurals
  )(units);

  const abbreviations = flow(
    mapValues(get('abbreviations')),
    omitBy(isNil),
    getUnitsWithPlurals,
  )(en);

  const xWordUnitsFiles = flow(
    toPairs,
    flatMap(([unit, alternateSpellings]) => (
      map(alternateSpelling => [alternateSpelling, unit], alternateSpellings)
    )),
    groupBy(flow(first, numberWords)),
    mapValues(fromPairs),
    toPairs,
    map(([numberOfWords, units]) => ({
      name: `${numberOfWords}-word-units.json`,
      source: JSON.stringify(units),
    }))
  )(unitAlternateSpellings);

  const abbreviationsFile = flow(
    toPairs,
    flatMap(([unit, abbreviations]) => (
      map(abbreviation => [abbreviation, unit], abbreviations)
    )),
    fromPairs,
    abbreviations => ({
      name: 'abbreviations.json',
      source: JSON.stringify(abbreviations),
    })
  )(abbreviations);

  return file([
    ...xWordUnitsFiles,
    abbreviationsFile,
  ], { src: true })
    .pipe(gulp.dest(enDataDir));
});

gulp.task('clean-en-math-formatting-data', () => del(enMathFormattingDataDir));

gulp.task('en-math-formatting-data', ['clean-en-math-formatting-data'], () => {
  const formatting = flow(
    mapValues(get('format')),
    omitBy(isNil),
  )(en);

  const plurals = flow(
    keys,
    without(keys(formatting)),
    map(unit => [unit, pluralizeLastWord(unit)]),
    fromPairs
  )(units);

  return file([
    { name: 'en-unit-formatting.json', source: JSON.stringify(formatting) },
    { name: 'en-unit-plurals.json', source: JSON.stringify(plurals) },
  ], { src: true })
    .pipe(gulp.dest(enMathFormattingDataDir));
});

gulp.task('build', ['data'], (cb) => {
  webpack({
    context: __dirname,
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'index.js',
      library: 'recora',
      libraryTarget: 'umd',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['latest'],
            plugins: [
              'transform-flow-strip-types',
              'transform-object-rest-spread',
              'transform-class-properties',
              'transform-exponentiation-operator',
            ],
          },
        },
        {
          test: /\.json$/,
          loader: 'json',
        },
      ],
    },
    externals: (context, request, cb) => {
      if (!/^\./.test(request)) {
        cb(null, `var ${request}`);
      } else {
        cb();
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.DedupePlugin(),
    ],
  }, (err, stats) => {
    if (err) {
      cb(err);
    } else if (stats.hasErrors()) {
      cb(new Error(stats.toJson('errors-only').errors[0]));
    } else {
      cb(null);
    }
  });
});

gulp.task('data', ['en-data', 'en-math-formatting-data']);
gulp.task('default', ['build']);
