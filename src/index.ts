import { formatResult } from './format.js';
import { parseMap } from './map.js';
import { simulate } from './simulate.js';
import type { Command, Direction, Position } from './types.js';

export * from './types.js';
export { parseMap } from './map.js';

export function simulateRover(
  start: Position,
  initialDirection: Direction,
  grid: readonly string[][],
  commands: readonly Command[],
): string {
  const map = parseMap(grid);
  const finalState = simulate(start, initialDirection, map, commands);
  return formatResult(finalState);
}
