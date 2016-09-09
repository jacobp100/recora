// @flow
import { __, map, flow, has, curry, join, range } from 'lodash/fp';
import {
  TOKEN_OPERATOR_EXPONENT,
  TOKEN_OPERATOR_MULTIPLY,
  TOKEN_OPERATOR_DIVIDE,
  TOKEN_OPERATOR_ADD,
  TOKEN_OPERATOR_SUBTRACT,
  TOKEN_OPERATOR_NEGATE,
  TOKEN_NUMBER,
  TOKEN_UNIT_NAME,
  TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX,
  TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE,
  TOKEN_COLOR,
  TOKEN_NOOP,
  TOKEN_VECTOR_START,
  TOKEN_VECTOR_SEPARATOR,
  TOKEN_VECTOR_END,
} from './types';
import createTokenizer from './modules/createTokenizer';


const twoWordUnits = {
  'degrees celsius': 'celsius',
  'degree celsius': 'celsius',
};
const oneWordUnits = {
  meters: 'meter',
  meter: 'meter',
  yard: 'yard',
  yards: 'yard',
  inches: 'inch',
  second: 'second',
};

const unitPrefixes = {
  per: -1,
  square: 2,
  cubic: 3,
};
const unitSuffixes = {
  squared: 2,
  cubed: 3,
};

const when = curry((fn, transform) => value => (fn(value) ? transform(value) : null));

const wordRegexpCreator = flow(
  range(0),
  map(() => '[a-z]+'),
  join('\\s+'),
  str => new RegExp(str, 'i')
);

const wordMatcher = ({ words, type, dictionary, penalty }) => ({
  token: when(has(__, dictionary), token => ({ type, value: dictionary[token] })),
  match: wordRegexpCreator(words),
  penalty,
});

/* eslint-disable max-len */
export default createTokenizer({
  number: [
    { match: /\d+/, token: token => ({ type: TOKEN_NUMBER, value: Number(token) }), penalty: -1000 },
  ],
  operator: [
    { match: '**', token: { type: TOKEN_OPERATOR_EXPONENT }, penalty: -1000 },
    { match: '^', token: { type: TOKEN_OPERATOR_EXPONENT }, penalty: -1000 },
    { match: /\*(?!\*)/, token: { type: TOKEN_OPERATOR_MULTIPLY }, penalty: -1000 },
    { match: '/', token: { type: TOKEN_OPERATOR_DIVIDE }, penalty: -1000 },
    { match: '+', token: { type: TOKEN_OPERATOR_ADD }, penalty: -1000 },
    { match: '-', token: { type: TOKEN_OPERATOR_SUBTRACT }, penalty: -1000 },
    { match: '-', token: { type: TOKEN_OPERATOR_NEGATE }, penalty: -500 },
  ],
  unit: [
    wordMatcher({ words: 2, type: TOKEN_UNIT_NAME, dictionary: twoWordUnits, penalty: -500 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_NAME, dictionary: oneWordUnits, penalty: -400 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_PREFIX, dictionary: unitPrefixes, penalty: -300 }),
    wordMatcher({ words: 1, type: TOKEN_UNIT_SUFFIX, dictionary: unitSuffixes, penalty: -300 }),
    { match: '/', token: { type: TOKEN_UNIT_PREFIX, value: -1 }, penalty: -1500 },
  ],
  color: [
    { match: /#[0-9a-f]{3,8}/, token: token => ({ type: TOKEN_COLOR, value: token }), penalty: -500 },
  ],
  brackets: [
    {
      match: '(',
      token: (token, state) => ({ type: TOKEN_BRACKET_OPEN, value: state.bracketLevel }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel + 1 }),
    },
    {
      match: ')',
      token: (token, state) => ({ type: TOKEN_BRACKET_CLOSE, value: state.bracketLevel - 1 }),
      penalty: -1000,
      updateState: state => ({ bracketLevel: state.bracketLevel - 1 }),
    },
  ],
  noop: [
    { match: /[a-z]+/i, token: { type: TOKEN_NOOP }, penalty: 10 },
  ],
  whitespace: [
    { match: /\s+/, penalty: 0 },
  ],
  otherCharacter: [
    // No numbers, whitespace, operators, or brackets
    // the less this catches, the better the perf
    { match: /[^\w\s*^/+\-%()\[\]]/, penalty: 1000 },
  ],
  // vectorElementSeparator: [
  //   { match: ',', token: { type: TOKEN_VECTOR_SEPARATOR }, penalty: 0, pop: true },
  //   { ref: 'vectorMisc' },
  // ],
  // vectorElement: [
  //   { ref: 'vector' },
  //   { ref: 'number', push: ['vectorElementSeparator'] },
  //   { ref: 'vectorMisc' },
  // ],
  // vectorMisc: [
  //   { match: ']', token: { type: TOKEN_VECTOR_END }, penalty: 0, pop: true },
  //   { ref: 'whitespace' },
  // ],
  // vector: [
  //   { match: '[', token: { type: TOKEN_VECTOR_START }, penalty: -500, push: ['vectorElement'] },
  // ],
  vectorBody: [
    { ref: 'vector' },
    { ref: 'number' },
    { ref: 'whitespace' },
    { match: ',', token: { type: TOKEN_VECTOR_SEPARATOR }, penalty: 0 },
    { match: ']', token: { type: TOKEN_VECTOR_END }, penalty: 0, pop: true },
  ],
  vector: [
    { match: '[', token: { type: TOKEN_VECTOR_START }, penalty: -500, push: ['vectorBody'] },
  ],
  default: [
    { ref: 'operator' },
    { ref: 'number' },
    { ref: 'unit' },
    { ref: 'color' },
    { ref: 'brackets' },
    { ref: 'vector' },
    { ref: 'noop' },
    { ref: 'whitespace' },
    { ref: 'otherCharacter' },
  ],
}, {
  bracketLevel: 0,
});
/* eslint-enable */
