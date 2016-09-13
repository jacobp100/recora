import test from 'ava';
import { forEach } from 'lodash/fp';
import {
  Pattern, CaptureWildcard, CaptureElement, CaptureOptions,
} from '../src/modules/patternMatcher';
/* eslint-disable no-unused-vars */
import {
  TOKEN_NUMBER, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX, TOKEN_UNIT_SUFFIX, TOKEN_BRACKET_OPEN,
  TOKEN_BRACKET_CLOSE, TOKEN_COLOR, TOKEN_NOOP, TOKEN_VECTOR_START, TOKEN_VECTOR_SEPARATOR,
  TOKEN_VECTOR_END,
} from '../src/tokenTypes';
/* eslint-enable */


/*
Testing notes:
We use macros for every test here. The most basic is shouldMatch and shouldNotMatch. Each take a
test object in the form { input, expected }, and does a test. You can use as many test objects as
you like in a single test. I.e.

```js
test('', matcher, shouldMatch, { input: ..., expected: ... }, { input: ..., expected: ... }, ...);
```

If you expect your output is a single capture group, where that capture group that should equal the
input, you can instead use an array to represent both the input and output. I.e.

```js
test('title', matcher, shouldMatch, [{ type: TOKEN_COLOR }]);
```

Lastly, we have a few more helpers. capture{Should,ShouldNot}Match takes a matcher, and evaluates
the test both when the matcher is and is not lazy.

captureDerivatives{Should,ShouldNot}Match takes a function that will be used to create both lazy
and non-lazy versions of both CaptureElement and CaptureOptions. I.e.

```js
test('title', captureDerivativesShouldNotMatch, makeCapture => makeCapture(TOKEN_NUMBER), ...);
```
*/

const baseMatcherAssertion = (shouldMatch, transform) => (t, patternMatcher, ...inputs) => {
  const callAssertionsWithPatternMatcher = patternMatcher => {
    forEach(inputValue => {
      const { input, expected } = 'input' in inputValue
        ? inputValue
        : { input: inputValue, expected: [inputValue] };

      const captureGroups = patternMatcher.match(input);

      if (shouldMatch) {
        t.deepEqual(captureGroups, expected);
      } else {
        t.is(captureGroups, null);
      }
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
const captureShouldMatch = baseMatcherAssertion(true, withLazy);
const captureShouldNotMatch = baseMatcherAssertion(false, withLazy);

const captureFactory = captureFactoryHandler => [
  captureFactoryHandler(pattern => new CaptureElement(pattern)),
  captureFactoryHandler(pattern => new CaptureElement(pattern)).lazy(),
  captureFactoryHandler(pattern => new CaptureOptions([pattern])),
  captureFactoryHandler(pattern => new CaptureOptions([pattern])).lazy(),
];
const captureDerivativesShouldMatch = baseMatcherAssertion(true, captureFactory);
const captureDerivativesShouldNotMatch = baseMatcherAssertion(false, captureFactory);

const createArray = patternMatcher => [patternMatcher];
const shouldMatch = baseMatcherAssertion(true, createArray);
const shouldNotMatch = baseMatcherAssertion(false, createArray);


test(
  "CaptureElement matches a single item if it's type is the same as the capture's",
  captureDerivativesShouldMatch,
  makeCapture => makeCapture(TOKEN_COLOR),
  [{ type: TOKEN_COLOR }],
);

test(
  "CaptureElement does not match a single item if it's type is the different the capture's",
  captureDerivativesShouldNotMatch,
  makeCapture => makeCapture(TOKEN_COLOR),
  [{ type: TOKEN_NUMBER }],
);

test(
  "CaptureElement matches all items of the if they are all the same type as the capture's",
  captureDerivativesShouldMatch,
  makeCapture => makeCapture(TOKEN_COLOR).any(),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "CaptureElement matches no items of the if any are a different type to the capture's",
  captureDerivativesShouldNotMatch,
  makeCapture => makeCapture(TOKEN_COLOR).any(),
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  "Negating an capture matches a single item if it's type is different to the capture's",
  captureDerivativesShouldMatch,
  makeCapture => makeCapture(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_COLOR }],
);

test(
  "Negating an capture does not match a single item if it's type is the same as the capture's",
  captureDerivativesShouldNotMatch,
  makeCapture => makeCapture(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_NUMBER }],
);

test(
  "Negating an capture matches all items if they all have a different type to the capture's",
  captureDerivativesShouldMatch,
  makeCapture => makeCapture(TOKEN_NUMBER).negate(),
  [{ type: TOKEN_COLOR }],
);

test(
  "Negating an capture matches no items if any are the same type as the capture's",
  captureDerivativesShouldNotMatch,
  makeCapture => makeCapture(TOKEN_NUMBER).negate().any(),
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  "Setting `from` on an capture will match items if the items' length is longer than `from`",
  captureDerivativesShouldMatch,
  makeCapture => makeCapture(TOKEN_COLOR).from(3).to(Infinity),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting `from` on an capture will not match items if the items' length is shorter than `from`",
  captureDerivativesShouldNotMatch,
  makeCapture => makeCapture(TOKEN_COLOR).from(3).to(Infinity),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting `to` on an capture will match items if the items' length is longer than `to`",
  captureDerivativesShouldMatch,
  makeCapture => makeCapture(TOKEN_COLOR).to(2),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "Setting `to` on an capture will not match items if the items' length is shorter than `to`",
  captureDerivativesShouldNotMatch,
  makeCapture => makeCapture(TOKEN_COLOR).to(2),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  "CaptureElement options matches a single item if it's type is included in the capture's",
  captureShouldMatch,
  new CaptureOptions([TOKEN_COLOR, TOKEN_NUMBER]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_NUMBER }],
);

test(
  "CaptureElement options does not match a single item if it's type is not in the capture's",
  captureShouldNotMatch,
  new CaptureOptions([TOKEN_COLOR, TOKEN_NUMBER]),
  [{ type: TOKEN_BRACKET_CLOSE }],
);

test(
  'CaptureWildcard should match a single capture',
  shouldMatch,
  new CaptureWildcard(),
  [{ type: TOKEN_COLOR }]
);

test(
  'CaptureWildcard should match no more than a single capture',
  shouldNotMatch,
  new CaptureWildcard(),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'CaptureWildcard should with `any` match all captures',
  shouldMatch,
  new CaptureWildcard().any(),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'CaptureWildcard should with `any` match all captures when lazy',
  shouldMatch,
  new CaptureWildcard().any().lazy(),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should match a single non-lazy entry if the entry matches the items',
  shouldMatch,
  new Pattern([new CaptureElement(TOKEN_COLOR).oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should not match a single non-lazy entry if the entry does not match the items',
  shouldNotMatch,
  new Pattern([new CaptureElement(TOKEN_NUMBER).oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should match a single lazy entry if the entry matches the items',
  shouldMatch,
  new Pattern([new CaptureElement(TOKEN_COLOR).lazy().oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should not match a single lazy entry if the entry does not match the items',
  shouldNotMatch,
  new Pattern([new CaptureElement(TOKEN_NUMBER).lazy().oneOrMore()]),
  [{ type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
);

test(
  'Pattern should match a two entries if every entry matches the items',
  shouldMatch,
  new Pattern([new CaptureElement(TOKEN_COLOR), new CaptureElement(TOKEN_COLOR)]),
  {
    input: [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
    expected: [[{ type: TOKEN_COLOR }], [{ type: TOKEN_COLOR }]],
  },
);

test(
  'Pattern should not match a two entries if any entry does not match the items',
  shouldNotMatch,
  new Pattern([new CaptureElement(TOKEN_NUMBER), new CaptureElement(TOKEN_NUMBER)]),
  [{ type: TOKEN_COLOR }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_NUMBER }, { type: TOKEN_COLOR }],
  [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
);

test(
  'Pattern should match with wildcards',
  shouldMatch,
  new Pattern([
    new CaptureElement(TOKEN_COLOR),
    new CaptureWildcard().any(),
    new CaptureElement(TOKEN_COLOR),
  ]),
  {
    input: [
      { type: TOKEN_COLOR },
      { type: TOKEN_UNIT_NAME },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
    ],
    expected: [
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_UNIT_NAME }, { type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
    ],
  },
);

test(
  'Patterns should be able to repeat',
  shouldMatch,
  new Pattern([new CaptureElement(TOKEN_COLOR), new CaptureElement(TOKEN_NUMBER)]).any(),
  {
    input: [{ type: TOKEN_COLOR }, { type: TOKEN_NUMBER }],
    expected: [[{ type: TOKEN_COLOR }], [{ type: TOKEN_NUMBER }]],
  },
  {
    input: [
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
    ],
    expected: [
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
    ],
  },
  {
    input: [
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
    ],
    expected: [
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
    ],
  },
);

test(
  'Patterns should be able to match sub patterns',
  shouldMatch,
  new Pattern([
    new CaptureElement(TOKEN_BRACKET_OPEN),
    new Pattern([new CaptureElement(TOKEN_COLOR), new CaptureElement(TOKEN_NUMBER)]).any(),
    new CaptureElement(TOKEN_BRACKET_CLOSE),
  ]),
  {
    input: [{ type: TOKEN_BRACKET_OPEN }, { type: TOKEN_BRACKET_CLOSE }],
    expected: [[{ type: TOKEN_BRACKET_OPEN }], [{ type: TOKEN_BRACKET_CLOSE }]],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
);

test(
  'Patterns should not incorrectly sub patterns',
  shouldNotMatch,
  new Pattern([
    new CaptureElement(TOKEN_BRACKET_OPEN),
    new Pattern([new CaptureElement(TOKEN_COLOR), new CaptureElement(TOKEN_NUMBER)]).any(),
    new CaptureElement(TOKEN_BRACKET_CLOSE),
  ]),
  [
    { type: TOKEN_BRACKET_OPEN },
  ],
  [
    { type: TOKEN_BRACKET_OPEN },
    { type: TOKEN_COLOR },
    { type: TOKEN_BRACKET_CLOSE },
  ],
  [
    { type: TOKEN_BRACKET_OPEN },
    { type: TOKEN_COLOR },
    { type: TOKEN_NUMBER },
  ],
  [
    { type: TOKEN_BRACKET_OPEN },
    { type: TOKEN_COLOR },
    { type: TOKEN_NUMBER },
    { type: TOKEN_COLOR },
    { type: TOKEN_BRACKET_CLOSE },
  ],
  [
    { type: TOKEN_BRACKET_OPEN },
    { type: TOKEN_COLOR },
    { type: TOKEN_NUMBER },
    { type: TOKEN_NUMBER },
    { type: TOKEN_COLOR },
    { type: TOKEN_NUMBER },
    { type: TOKEN_BRACKET_CLOSE },
  ],
);

test(
  'Patterns should be able to match sub-sub-patterns',
  shouldMatch,
  new Pattern([
    new CaptureElement(TOKEN_BRACKET_OPEN),
    new Pattern([
      new CaptureElement(TOKEN_COLOR),
      new Pattern([
        new CaptureElement(TOKEN_UNIT_PREFIX),
        new CaptureElement(TOKEN_UNIT_NAME),
        new CaptureElement(TOKEN_UNIT_SUFFIX),
      ]).any(),
      new CaptureElement(TOKEN_NUMBER),
    ]).any(),
    new CaptureElement(TOKEN_BRACKET_CLOSE),
  ]),
  {
    input: [{ type: TOKEN_BRACKET_OPEN }, { type: TOKEN_BRACKET_CLOSE }],
    expected: [[{ type: TOKEN_BRACKET_OPEN }], [{ type: TOKEN_BRACKET_CLOSE }]],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_UNIT_PREFIX },
      { type: TOKEN_UNIT_NAME },
      { type: TOKEN_UNIT_SUFFIX },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_UNIT_PREFIX }],
      [{ type: TOKEN_UNIT_NAME }],
      [{ type: TOKEN_UNIT_SUFFIX }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
  {
    input: [
      { type: TOKEN_BRACKET_OPEN },
      { type: TOKEN_COLOR },
      { type: TOKEN_NUMBER },
      { type: TOKEN_COLOR },
      { type: TOKEN_UNIT_PREFIX },
      { type: TOKEN_UNIT_NAME },
      { type: TOKEN_UNIT_SUFFIX },
      { type: TOKEN_NUMBER },
      { type: TOKEN_BRACKET_CLOSE },
    ],
    expected: [
      [{ type: TOKEN_BRACKET_OPEN }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_COLOR }],
      [{ type: TOKEN_UNIT_PREFIX }],
      [{ type: TOKEN_UNIT_NAME }],
      [{ type: TOKEN_UNIT_SUFFIX }],
      [{ type: TOKEN_NUMBER }],
      [{ type: TOKEN_BRACKET_CLOSE }],
    ],
  },
);
