// @flow
/* globals Generator */
import { set, map, includes } from 'lodash/fp';

type CaptureRange = [number, number];
type MatchStack = { index: number, captureRanges: CaptureRange[], array: string[] }

class BaseMatcher {
  pattern: any = null;
  isNegative = false;
  isLazy = false;
  start = 1;
  end = 1;

  constructor(pattern) {
    this.pattern = pattern;
  }

  from(start) {
    return set('start', start, this);
  }

  to(end) {
    return set('end', end, this);
  }

  zeroOrOne() {
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

    const matchStack = { index: 0, captureRanges: [], array: types };
    const minIndex = tokens.length;
    for (const result of this.getMatches(matchStack)) {
      if (result.index >= minIndex) {
        const capturedTokens = map(captureRange => (
          tokens.slice(captureRange[0], captureRange[1])
        ), result.captureRanges);

        return capturedTokens;
      }
    }
    return null;
  }

  * getMatches(matchStack: MatchStack) { // eslint-disable-line
    throw new Error('Not implemented');
  }
}

class BaseCaptureMatcher extends BaseMatcher {
  conforms(element: string, pattern: any) { // eslint-disable-line
    throw new Error('Not implemented');
  }

  * getLazyMatchesFrom(
    startI: number,
    end: number,
    lastElementIndex: number,
    { index, captureRanges, array }: MatchStack
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
    { index, captureRanges, array }: MatchStack
  ) {
    const { pattern, isNegative } = this;

    for (let i = startI; i <= end; i += 1) {
      yield {
        index: index + i,
        captureRanges: captureRanges.concat([[index, index + i]]),
        array: array.slice(i),
      };
      if (i !== lastElementIndex && (this.conforms(array[i], pattern) === isNegative)) return;
    }
  }

  * getMatches(matchStack: MatchStack) {
    // const { index, captureRanges, array } = matchStack;
    const { array } = matchStack;
    const { pattern, isNegative, isLazy, start } = this;

    if (start > array.length) return;

    let i = 0;

    for (; i < start; i += 1) {
      if (this.conforms(array[i], pattern) === isNegative) return;
    }

    // if (i === this.end) {
    //   yield {
    //     index: index + i,
    //     captureRanges: captureRanges.concat([[index, index + i]]),
    //     array: array.slice(i),
    //   };
    //   return;
    // }

    const lastElementIndex = array.length;
    const end = Math.min(this.end, lastElementIndex);
    if (isLazy) {
      yield* this.getLazyMatchesFrom(i, end, lastElementIndex, matchStack);
    } else {
      yield* this.getNonLazyMatchesFrom(i, end, lastElementIndex, matchStack);
    }
  }
}

export class CaptureElement extends BaseCaptureMatcher {
  conforms(element: string, pattern: any) {
    return element === pattern;
  }
}

export class CaptureOptions extends BaseCaptureMatcher {
  conforms(element: string, pattern: any) {
    return includes(element, pattern);
  }
}

export class CaptureWildcard extends BaseCaptureMatcher {
  conforms() {
    return true;
  }
}

export class Pattern extends BaseMatcher {
  * getSubmatches(
    iteration: number,
    remainingPatterns: any[],
    matchStack: MatchStack
  ): Generator<MatchStack, void, void> {
    const numRemainingPatterns = remainingPatterns.length;

    if (numRemainingPatterns === 0) {
      if (iteration >= this.start) {
        // Completed an iteration and we completed the minimum number of iterations
        yield matchStack;
      }

      if (iteration < this.end - 1) {
        yield* this.getSubmatches(iteration + 1, this.pattern, matchStack);
      }
    } else if (numRemainingPatterns > 0) {
      const remainingPattern = remainingPatterns[0];
      const isFirstPattern = numRemainingPatterns === this.pattern.length;
      const isLastPattern = numRemainingPatterns === 1;
      let didMatchSubCase = false;

      for (const match of remainingPattern.getMatches(matchStack)) {
        didMatchSubCase = true;

        if (isLastPattern && match.array.length === 0) {
          yield match;
        } else {
          yield* this.getSubmatches(iteration, remainingPatterns.slice(1), match);
        }
      }

      const matchedNothing = !didMatchSubCase && isFirstPattern;

      if (matchedNothing && iteration === 0 && this.start === 0) {
        // Pattern matched nothing and that is permitted (new Pattern().any())
        // Should this match? Pattern itself is not a capture group
        yield matchStack;
      }
    }
  }

  * getMatches(matchStack: MatchStack): Generator<MatchStack, void, void> {
    yield* this.getSubmatches(0, this.pattern, matchStack);
  }
}
