import type { Cell, MapModel, Position } from './types.js';

const FREE_SYMBOLS = new Set(['🟩', '🟫']);
const OBSTACLE_SYMBOLS = new Set(['🌳', '🪨']);

function cellFor(symbol: string): Cell {
  if (OBSTACLE_SYMBOLS.has(symbol)) {
    return 'OBSTACLE';
  }
  if (FREE_SYMBOLS.has(symbol)) {
    return 'FREE';
  }
  throw new Error(`Symbole de carte inconnu : ${symbol}`);
}

export function parseMap(grid: readonly string[][]): MapModel {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  const cells: Cell[][] = grid.map((row) => row.map(cellFor));
  return { width, height, grid: cells };
}

export function isObstacle(map: MapModel, position: Position): boolean {
  return map.grid[position.y][position.x] === 'OBSTACLE';
}

function wrapAxis(value: number, size: number): number {
  return ((value % size) + size) % size;
}

export function wrapPosition(map: MapModel, position: Position): Position {
  return {
    x: wrapAxis(position.x, map.width),
    y: wrapAxis(position.y, map.height),
  };
}
