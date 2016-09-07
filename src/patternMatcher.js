import { set, map, includes } from 'lodash/fp';

type IndexRange = [number, number];

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

  match(tokens) {
    const types = map('type', tokens);

    const minIndex = tokens.length;
    for (const result of this.getMatches(0, [], types)) {
      if (result.index >= minIndex) {
        const capturedTokens = map(captureRange => (
          tokens.slice(captureRange[0], captureRange[1])
        ), result.captureRanges);

        return capturedTokens;
      }
    }
    return null;
  }
}

class BaseElementMatcher extends BaseMatcher {
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
    captureRanges: IndexRange[],
    array: string[]
  ) {
    const { pattern, isNegative } = this;

    for (let i = startI; i <= end; i += 1) {
      if (i === lastElementIndex || this.conforms(array[i], pattern) === isNegative) {
        yield {
          index: index + i,
          captureRanges: captureRanges.concat([[index, index + i]]),
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
    captureRanges: IndexRange[],
    array: string[]
  ) {
    const { pattern, isNegative } = this;

    // It might be good do this in reverse, since it could mean less matches,
    // But we have to run through the whole thing before returning the list in reverse
    for (let i = startI; i <= end; i += 1) {
      if (i !== lastElementIndex && (this.conforms(array[i], pattern) === isNegative)) return;
      yield {
        index: index + i,
        captureRanges: captureRanges.concat([[index, index + i]]),
        array: array.slice(i),
      };
    }
  }

  * getMatches(index: number, captureRanges: IndexRange[], array: string[]) {
    const { pattern, isNegative, isLazy, start } = this;

    if (start > array.length) return;

    let i = 0;

    for (; i < start; i += 1) {
      if (this.conforms(array[i], pattern) === isNegative) return;
    }

    if (i === this.end) {
      yield {
        index: index + i,
        captureRanges: captureRanges.concat([[index, index + i]]),
        array: array.slice(i),
      };
      return;
    }

    const lastElementIndex = array.length;
    const end = Math.min(this.end, lastElementIndex);
    if (isLazy) {
      yield* this.getLazyMatchesFrom(i, end, lastElementIndex, index, captureRanges, array);
    } else {
      yield* this.getNonLazyMatchesFrom(i, end, lastElementIndex, index, captureRanges, array);
    }
  }
}

export class Element extends BaseElementMatcher {
  conforms(element, pattern) {
    return element === pattern;
  }
}

export class ElementOptions extends BaseElementMatcher {
  conforms(element, pattern) {
    return includes(element, pattern);
  }
}

export class Wildcard extends BaseMatcher {
  lazy() {
    return set('isLazy', true, this);
  }

  * getMatches(index: number, captureRanges: IndexRange[], array: string[]) {
    const end = index + array.length;
    if (this.isLazy) {
      yield {
        index: end,
        captureRanges: captureRanges.concat([[index, end]]),
        array: [],
      };
    } else {
      for (let i = index; i <= end; i += 1) {
        yield {
          index: i,
          captureRanges: captureRanges.concat([[index, i]]),
          array: array.slice(i),
        };
      }
    }
  }
}

export class Pattern extends BaseMatcher {
  * getSubmatches(iteration, remainingPatterns, index, captureRanges, array) {
    if (array.length === 0) {
      if (remainingPatterns.length === 0) yield { index, captureRanges, array };
      return;
    }

    if (remainingPatterns.length > 0) {
      const remainingPattern = remainingPatterns[0];
      for (const match of remainingPattern.getMatches(index, captureRanges, array)) {
        yield* this.getSubmatches(
          iteration,
          remainingPatterns.slice(1),
          match.index,
          match.captureRanges,
          match.array
        );
      }
    } else {
      yield* this.getSubmatches(
        iteration + 1,
        this.pattern,
        index,
        captureRanges,
        array
      );
    }
  }

  * getMatches(index: number, captureRanges: IndexRange[], array: string[]) {
    yield* this.getSubmatches(0, this.pattern, index, captureRanges, array);
  }
}

