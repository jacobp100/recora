/* eslint-disable no-unused-vars */
import {
  OPERATOR_EXPONENT, OPERATOR_MULTIPLY, OPERATOR_DIVIDE, OPERATOR_ADD, OPERATOR_SUBTRACT,
  OPERATOR_NEGATE, TOKEN_OPERATOR, TOKEN_NUMBER, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX, TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE, TOKEN_COLOR, TOKEN_NOOP,
  TOKEN_VECTOR_START, TOKEN_VECTOR_SEPARATOR, TOKEN_VECTOR_END,
} from './types';
import type { Token } from './types'; // eslint-disable-line
import { Pattern, Wildcard, Element, ElementOptions, matchPatterns } from './patternMatcher';
/* eslint-enable */

// console.log(matchPatterns([
//   new Element(TOKEN_NUMBER).any(),
// ], [{ type: TOKEN_NUMBER }, { type: TOKEN_NUMBER }, { type: TOKEN_NUMBER }]));
console.log(
  (new Pattern([
    new Wildcard().any(),
    new Element(TOKEN_BRACKET_OPEN),
    new ElementOptions([TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE]).negate().lazy().any(),
    new Element(TOKEN_BRACKET_CLOSE),
    new Wildcard().lazy(),
  ])).match([
    { type: TOKEN_NUMBER },
    { type: TOKEN_NUMBER },
    { type: TOKEN_BRACKET_OPEN },
    { type: TOKEN_NUMBER },
    { type: TOKEN_BRACKET_OPEN },
    { type: TOKEN_NUMBER },
    { type: TOKEN_COLOR },
    { type: TOKEN_NUMBER },
    { type: TOKEN_BRACKET_CLOSE },
    { type: TOKEN_UNIT_NAME },
    { type: TOKEN_NUMBER },
    { type: TOKEN_COLOR },
    { type: TOKEN_BRACKET_CLOSE },
    { type: TOKEN_COLOR },
    { type: TOKEN_COLOR },
    { type: TOKEN_NUMBER },
  ])
);

// const transform = [
//   new Pattern([
//     new Element(TOKEN_OPERATOR).negate().any(),
//     new Pattern([
//       new Element(TOKEN_OPERATOR),
//       new Element(TOKEN_OPERATOR).negate().any(),
//     ]).oneOrMore(),
//   ]),
// ];
