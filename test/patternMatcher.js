import test from 'ava';
import { forEach } from 'lodash/fp';
import { Pattern, Wildcard, Element, ElementOptions, matchPatterns } from '../src/patternMatcher';
/* eslint-disable no-unused-vars */
import {
  OPERATOR_EXPONENT, OPERATOR_MULTIPLY, OPERATOR_DIVIDE, OPERATOR_ADD, OPERATOR_SUBTRACT,
  OPERATOR_NEGATE, TOKEN_OPERATOR, TOKEN_NUMBER, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX, TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE, TOKEN_COLOR, TOKEN_NOOP,
  TOKEN_VECTOR_START, TOKEN_VECTOR_SEPARATOR, TOKEN_VECTOR_END,
} from '../src/types';
/* eslint-enable */


const elementMatchAssertion = fnName => (t, patternMatcher, ...inputs) => {
  t.plan(inputs.length * 2);

  forEach(input => {
    const captureGroups = patternMatcher.match(input);
    t[fnName](captureGroups, [input]);
  }, inputs);

  forEach(input => {
    const captureGroups = patternMatcher.lazy().match(input);
    t[fnName](captureGroups, [input]);
  }, inputs);
};
const elementShouldMatch = elementMatchAssertion('deepEqual');
const elementShouldNotMatch = elementMatchAssertion('notDeepEqual');

test(
  "Element matches a single item if it's type is the same as the element's",
  elementShouldMatch,
  new Element(TOKEN_COLOR),
  [{ type: TOKEN_COLOR }]
);

test(
  "Element does not match a single item if it's type is the different the element's",
  elementShouldNotMatch,
  new Element(TOKEN_COLOR),
  [{ type: TOKEN_NUMBER }]
);

test(
  "Element matches all items of the if they are all the same type as the element's",
  elementShouldMatch,
  new Element(TOKEN_COLOR).any(),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }]
);

test(
  "Element matches no items of the if any are a different type to the element's",
  elementShouldNotMatch,
  new Element(TOKEN_COLOR).any(),
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  "Negating an element matches a single item if it's type is different to the element's",
  elementShouldMatch,
  new Element(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_COLOR }]
);

test(
  "Negating an element does not match a single item if it's type is the same as the element's",
  elementShouldNotMatch,
  new Element(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_NUMBER }]
);

test(
  "Negating an element matches all items if they all have a different type to the element's",
  elementShouldMatch,
  new Element(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_COLOR }]
);

test(
  "Negating an element matches no items if any are the same type as the element's",
  elementShouldNotMatch,
  new Element(TOKEN_NUMBER).negate().any(),
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  "Setting the from element will match items if the items' length is longer than `from`",
  elementShouldMatch,
  new Element(TOKEN_COLOR).from(3).to(Infinity),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }]
);

test(
  "Setting the from element will not match items if the items' length is shorter than `from`",
  elementShouldNotMatch,
  new Element(TOKEN_COLOR).from(3).to(Infinity),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting the to element will match items if the items' length is longer than `to`",
  elementShouldMatch,
  new Element(TOKEN_COLOR).to(2),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting the to element will not match items if the items' length is shorter than `to`",
  elementShouldNotMatch,
  new Element(TOKEN_COLOR).to(2),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }]
);
