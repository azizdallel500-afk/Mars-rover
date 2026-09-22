import { describe, expect, it } from 'vitest';
import { formatResult } from '../src/format.js';
import { simulateRover } from '../src/index.js';

function freeGrid(width: number, height: number): string[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => '🟩'));
}

describe('EX-08 — restitution du résultat final', () => {
  it('formatResult produit la chaîne "<x> <y> <direction>"', () => {
    expect(formatResult({ position: { x: 1, y: 2 }, direction: 'E' })).toBe('1 2 E');
  });

  it('simulateRover retourne directement la chaîne formatée', () => {
    const result = simulateRover({ x: 0, y: 0 }, 'N', freeGrid(5, 5), [
      'ADVANCE',
      'ADVANCE',
      'TURN_RIGHT',
      'ADVANCE',
    ]);
    expect(result).toBe('1 2 E');
  });

  it('rejoue EX-09 via le point d’entrée public', () => {
    const result = simulateRover({ x: 4, y: 3 }, 'E', freeGrid(5, 5), ['ADVANCE']);
    expect(result).toBe('0 3 E');
  });
});
