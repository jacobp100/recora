import test from 'ava';
import { forEach } from 'lodash/fp';
import { Pattern, Wildcard, Element, ElementOptions } from '../src/patternMatcher';
/* eslint-disable no-unused-vars */
import {
  OPERATOR_EXPONENT, OPERATOR_MULTIPLY, OPERATOR_DIVIDE, OPERATOR_ADD, OPERATOR_SUBTRACT,
  OPERATOR_NEGATE, TOKEN_OPERATOR, TOKEN_NUMBER, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX, TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE, TOKEN_COLOR, TOKEN_NOOP,
  TOKEN_VECTOR_START, TOKEN_VECTOR_SEPARATOR, TOKEN_VECTOR_END,
} from '../src/types';
/* eslint-enable */


const baseMatcherAssertion = (fnName, transform) => (t, patternMatcher, ...inputs) => {
  const callAssertionsWithPatternMatcher = patternMatcher => {
    forEach(input => {
      const captureGroups = patternMatcher.match(input);
      t[fnName](captureGroups, [input]);
    }, inputs);
  };

  const patternMatchers = transform(patternMatcher);

  t.plan(inputs.length * patternMatchers.length);
  forEach(callAssertionsWithPatternMatcher, patternMatchers);
};

const withLazy = patternMatcher => [
  patternMatcher,
  patternMatcher.lazy(),
];
const elementShouldMatch = baseMatcherAssertion('deepEqual', withLazy);
const elementShouldNotMatch = baseMatcherAssertion('notDeepEqual', withLazy);

const elementFactory = elementFactoryHandler => [
  elementFactoryHandler(pattern => new Element(pattern)),
  elementFactoryHandler(pattern => new Element(pattern)).lazy(),
  elementFactoryHandler(pattern => new ElementOptions([pattern])),
  elementFactoryHandler(pattern => new ElementOptions([pattern])).lazy(),
];
const elementDerivativesShouldMatch = baseMatcherAssertion('deepEqual', elementFactory);
const elementDerivativesShouldNotMatch = baseMatcherAssertion('notDeepEqual', elementFactory);

const createArray = patternMatcher => [
  patternMatcher,
];
const patternMatcherSingleEntryShouldMatch = baseMatcherAssertion('deepEqual', createArray);
const patternMatcherSingleEntryShouldNotMatch = baseMatcherAssertion('notDeepEqual', createArray);


test(
  "Element matches a single item if it's type is the same as the element's",
  elementDerivativesShouldMatch,
  makeElement => makeElement(TOKEN_COLOR),
  [{ type: TOKEN_COLOR }],
);

test(
  "Element does not match a single item if it's type is the different the element's",
  elementDerivativesShouldNotMatch,
  makeElement => makeElement(TOKEN_COLOR),
  [{ type: TOKEN_NUMBER }],
);

test(
  "Element matches all items of the if they are all the same type as the element's",
  elementDerivativesShouldMatch,
  makeElement => makeElement(TOKEN_COLOR).any(),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Element matches no items of the if any are a different type to the element's",
  elementDerivativesShouldNotMatch,
  makeElement => makeElement(TOKEN_COLOR).any(),
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  "Negating an element matches a single item if it's type is different to the element's",
  elementDerivativesShouldMatch,
  makeElement => makeElement(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_COLOR }],
);

test(
  "Negating an element does not match a single item if it's type is the same as the element's",
  elementDerivativesShouldNotMatch,
  makeElement => makeElement(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_NUMBER }],
);

test(
  "Negating an element matches all items if they all have a different type to the element's",
  elementDerivativesShouldMatch,
  makeElement => makeElement(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_COLOR }],
);

test(
  "Negating an element matches no items if any are the same type as the element's",
  elementDerivativesShouldNotMatch,
  makeElement => makeElement(TOKEN_NUMBER).negate().any(),
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  "Setting `from` on an element will match items if the items' length is longer than `from`",
  elementDerivativesShouldMatch,
  makeElement => makeElement(TOKEN_COLOR).from(3).to(Infinity),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting `from` on an element will not match items if the items' length is shorter than `from`",
  elementDerivativesShouldNotMatch,
  makeElement => makeElement(TOKEN_COLOR).from(3).to(Infinity),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting `to` on an element will match items if the items' length is longer than `to`",
  elementDerivativesShouldMatch,
  makeElement => makeElement(TOKEN_COLOR).to(2),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting `to` on an element will not match items if the items' length is shorter than `to`",
  elementDerivativesShouldNotMatch,
  makeElement => makeElement(TOKEN_COLOR).to(2),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Element options matches a single item if it's type is included in the element's",
  elementShouldMatch,
  new ElementOptions([TOKEN_COLOR, TOKEN_NUMBER]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_NUMBER }],
);

test(
  "Element options does not match a single item if it's type is not included in the element's",
  elementShouldNotMatch,
  new ElementOptions([TOKEN_COLOR, TOKEN_NUMBER]),
  [{ type: TOKEN_OPERATOR }],
);

test(
  'Pattern should match a single non-lazy entry if the entry matches the items',
  patternMatcherSingleEntryShouldMatch,
  new Pattern([new Element(TOKEN_COLOR).oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should not match a single non-lazy entry if the entry does not match the items',
  patternMatcherSingleEntryShouldNotMatch,
  new Pattern([new Element(TOKEN_NUMBER).oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should match a single lazy entry if the entry matches the items',
  patternMatcherSingleEntryShouldMatch,
  new Pattern([new Element(TOKEN_COLOR).lazy().oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should not match a single lazy entry if the entry does not match the items',
  patternMatcherSingleEntryShouldNotMatch,
  new Pattern([new Element(TOKEN_NUMBER).lazy().oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);
