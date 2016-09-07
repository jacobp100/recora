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

  negate() {
    return set('isNegative', true, this);
  }

  lazy() {
    return set('isLazy', true, this);
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

export class Wildcard extends BaseElementMatcher {
  conforms() {
    return true;
  }
}

export class Pattern extends BaseMatcher {
  * getSubmatches(iteration, remainingPatterns, index, captureRanges, array) {
    const numRemainingPatterns = remainingPatterns.length;
    const isLastPattern = numRemainingPatterns === 1;

    if (numRemainingPatterns === 0) {
      if (iteration >= this.start) {
        // Completed an iteration and we completed the minimum number of iterations
        yield { index, captureRanges, array };
      }

      if (iteration < this.end) {
        yield* this.getSubmatches(
          iteration + 1,
          this.pattern,
          index,
          captureRanges,
          array
        );
      }
    } else if (numRemainingPatterns > 0) {
      const remainingPattern = remainingPatterns[0];
      let didMatchSubCase = false;

      for (const match of remainingPattern.getMatches(index, captureRanges, array)) {
        didMatchSubCase = true;

        if (isLastPattern && match.array.length === 0) {
          yield match;
        } else {
          yield* this.getSubmatches(
            iteration,
            remainingPatterns.slice(1),
            match.index,
            match.captureRanges,
            match.array
          );
        }
      }

      const matchedNothing = !didMatchSubCase && remainingPatterns.length === this.pattern.length;

      if (matchedNothing && iteration >= this.start) {
        // Pattern matched nothing and that is permitted (new Pattern().any())
        yield { index, captureRanges, array };
      }
    }
  }

  * getMatches(index: number, captureRanges: IndexRange[], array: string[]) {
    yield* this.getSubmatches(1, this.pattern, index, captureRanges, array);
  }
}
