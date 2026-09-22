import { describe, expect, it } from 'vitest';
import { deltaFor, turnLeft, turnRight } from '../src/direction.js';
import type { Direction } from '../src/types.js';

describe('turnRight (EX-04)', () => {
  it('cycles N→E→S→W→N', () => {
    expect(turnRight('N')).toBe('E');
    expect(turnRight('E')).toBe('S');
    expect(turnRight('S')).toBe('W');
    expect(turnRight('W')).toBe('N');
  });
});

describe('turnLeft (EX-05)', () => {
  it('cycles N→W→S→E→N', () => {
    expect(turnLeft('N')).toBe('W');
    expect(turnLeft('W')).toBe('S');
    expect(turnLeft('S')).toBe('E');
    expect(turnLeft('E')).toBe('N');
  });
});

describe('turnRight et turnLeft sont inverses', () => {
  it('ramènent à la direction initiale', () => {
    const directions: Direction[] = ['N', 'E', 'S', 'W'];
    for (const direction of directions) {
      expect(turnLeft(turnRight(direction))).toBe(direction);
      expect(turnRight(turnLeft(direction))).toBe(direction);
    }
  });
});

describe('deltaFor (convention R-02)', () => {
  it('retourne le bon vecteur de déplacement pour les 4 directions', () => {
    expect(deltaFor('N')).toEqual({ x: 0, y: 1 });
    expect(deltaFor('S')).toEqual({ x: 0, y: -1 });
    expect(deltaFor('E')).toEqual({ x: 1, y: 0 });
    expect(deltaFor('W')).toEqual({ x: -1, y: 0 });
  });
});
