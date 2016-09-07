import { set, map, includes } from 'lodash/fp';
/* eslint-disable no-unused-vars */
import {
  OPERATOR_EXPONENT, OPERATOR_MULTIPLY, OPERATOR_DIVIDE, OPERATOR_ADD, OPERATOR_SUBTRACT,
  OPERATOR_NEGATE, TOKEN_OPERATOR, TOKEN_NUMBER, TOKEN_UNIT_NAME, TOKEN_UNIT_PREFIX,
  TOKEN_UNIT_SUFFIX, TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE, TOKEN_COLOR, TOKEN_NOOP,
  TOKEN_VECTOR_START, TOKEN_VECTOR_SEPARATOR, TOKEN_VECTOR_END,
} from './types';
import type { Token } from './types'; // eslint-disable-line
/* eslint-enable */

type IndexRange = [number, number];
// type Match = { captured: IndexRange[], index: number };

class BaseMatcher {
  constructor(pattern) {
    this.pattern = pattern;
    this.isNegative = false;
    this.isLazy = false;
    this.start = 1;
    this.end = 1;
  }

  from(start) {
    return set('start', start, this);
  }

  to(end) {
    return set('end', end, this);
  }

  optional() {
    return this.from(0).to(1);
  }

  any() {
    return this.from(0).to(Infinity);
  }

  oneOrMore() {
    return this.from(1).to(Infinity);
  }

  match(types) {
    for (const firstMatch of this.getMatches(0, [], types)) {
      return firstMatch;
    }
    return null;
  }
}

class ElementMatcher extends BaseMatcher {
  negate() {
    return set('isNegative', true, this);
  }

  lazy() {
    return set('isLazy', true, this);
  }

  * getLazyMatchesFrom(
    startI: number,
    end: number,
    lastElementIndex: number,
    index: number,
    captured: IndexRange[],
    array: string[]
  ) {
    const { pattern, isNegative } = this;

    for (let i = startI; i <= end; i += 1) {
      if (i === lastElementIndex || this.conforms(array[i], pattern) === isNegative) {
        yield {
          index: index + i,
          captured: captured.concat([[index, index + i]]),
          array: array.slice(i),
        };
        return;
      }
    }
  }

  * getNonLazyMatchesFrom(
    startI: number,
    end: number,
    lastElementIndex: number,
    index: number,
    captured: IndexRange[],
    array: string[]
  ) {
    const { pattern, isNegative } = this;

    for (let i = startI; i <= end; i += 1) {
      if (i !== lastElementIndex && (this.conforms(array[i], pattern) === isNegative)) return;
      yield {
        index: index + i,
        captured: captured.concat([[index, index + i]]),
        array: array.slice(i),
      };
    }
  }

  * getMatches(index: number, captured: IndexRange[], array: string[]) {
    const { pattern, isNegative, isLazy, start } = this;

    if (start > array.length) return;

    let i = 0;

    for (; i < start; i += 1) {
      if (this.conforms(array[i], pattern) === isNegative) return;
    }

    if (i === this.end) {
      yield {
        index: index + i,
        captured: captured.concat([[index, index + i]]),
        array: array.slice(i),
      };
      return;
    }

    const lastElementIndex = array.length;
    const end = Math.min(this.end, lastElementIndex);
    if (isLazy) {
      yield* this.getLazyMatchesFrom(i, end, lastElementIndex, index, captured, array);
    } else {
      yield* this.getNonLazyMatchesFrom(i, end, lastElementIndex, index, captured, array);
    }
  }
}

class Element extends ElementMatcher {
  conforms(element, pattern) {
    return element === pattern;
  }
}

class ElementOptions extends ElementMatcher {
  conforms(element, pattern) {
    return includes(element, pattern);
  }
}

class Wildcard extends BaseMatcher {
  lazy() {
    return set('isLazy', true, this);
  }

  * getMatches(index: number, captured: IndexRange[], array: string[]) {
    const end = index + array.length;
    if (this.isLazy) {
      yield {
        index: end,
        captured: captured.concat([[index, end]]),
        array: [],
      };
    } else {
      for (let i = index; i <= end; i += 1) {
        yield {
          index: i,
          captured: captured.concat([[index, i]]),
          array: array.slice(i),
        };
      }
    }
  }
}

class Pattern extends BaseMatcher {
  * getSubmatches(iteration, remainingPatterns, index, captured, array) {
    if (array.length === 0) {
      if (remainingPatterns.length === 0) yield { index, captured, array };
      return;
    }

    if (remainingPatterns.length > 0) {
      const remainingPattern = remainingPatterns[0];
      for (const match of remainingPattern.getMatches(index, captured, array)) {
        yield* this.getSubmatches(
          iteration,
          remainingPatterns.slice(1),
          match.index,
          match.captured,
          match.array
        );
      }
    } else {
      yield* this.getSubmatches(
        iteration + 1,
        this.pattern,
        index,
        captured,
        array
      );
    }
  }

  * getMatches(index: number, captured: IndexRange[], array: string[]) {
    yield* this.getSubmatches(0, this.pattern, index, captured, array);
  }
}

const matchPatterns = (spec, tokens) => {
  const types = map('type', tokens);
  const getTokensFromCaptureRange = map(captureRange => (
    tokens.slice(captureRange[0], captureRange[1])
  ));

  const match = spec[0].match(types);

  if (match) {
    const tokensFromMatch = getTokensFromCaptureRange(match.captured);
    return tokensFromMatch;
  }
  return null;
};

// console.log(matchPatterns([
//   new Element(TOKEN_NUMBER).any(),
// ], [{ type: TOKEN_NUMBER }, { type: TOKEN_NUMBER }, { type: TOKEN_NUMBER }]));
console.log(matchPatterns([
  new Pattern([
    new Wildcard(),
    new Element(TOKEN_BRACKET_OPEN),
    new ElementOptions([TOKEN_BRACKET_OPEN, TOKEN_BRACKET_CLOSE]).negate().lazy().any(),
    new Element(TOKEN_BRACKET_CLOSE),
    new Wildcard().lazy(),
  ]),
], [
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
]));

// const transform = [
//   new Pattern([
//     new Element(TOKEN_OPERATOR).negate().any(),
//     new Pattern([
//       new Element(TOKEN_OPERATOR),
//       new Element(TOKEN_OPERATOR).negate().any(),
//     ]).oneOrMore(),
//   ]),
// ];
