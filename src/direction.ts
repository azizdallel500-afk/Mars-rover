import type { Direction, Position } from './types.js';

const CYCLE: readonly Direction[] = ['N', 'E', 'S', 'W'];

export function turnRight(direction: Direction): Direction {
  const index = CYCLE.indexOf(direction);
  return CYCLE[(index + 1) % CYCLE.length];
}

export function turnLeft(direction: Direction): Direction {
  const index = CYCLE.indexOf(direction);
  return CYCLE[(index - 1 + CYCLE.length) % CYCLE.length];
}

export function deltaFor(direction: Direction): Position {
  switch (direction) {
    case 'N':
      return { x: 0, y: 1 };
    case 'S':
      return { x: 0, y: -1 };
    case 'E':
      return { x: 1, y: 0 };
    case 'W':
      return { x: -1, y: 0 };
  }
}
