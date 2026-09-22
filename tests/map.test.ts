import { describe, expect, it } from 'vitest';
import { isObstacle, parseMap, wrapPosition } from '../src/map.js';

describe('parseMap (EX-02)', () => {
  it('identifie un obstacle avec le jeu de symboles 🟩/🌳', () => {
    const grid = [
      ['🟩', '🟩', '🟩'],
      ['🟩', '🟩', '🟩'],
      ['🟩', '🟩', '🟩'],
      ['🟩', '🟩', '🟩'],
      ['🟩', '🌳', '🟩'],
    ];
    const map = parseMap(grid);
    expect(isObstacle(map, { x: 1, y: 4 })).toBe(true);
    expect(isObstacle(map, { x: 0, y: 4 })).toBe(false);
    expect(isObstacle(map, { x: 0, y: 0 })).toBe(false);
  });

  it('produit un résultat strictement identique avec le jeu 🟫/🪨 (R-01)', () => {
    const greenGrid = [
      ['🟩', '🌳'],
      ['🌳', '🟩'],
    ];
    const brownGrid = [
      ['🟫', '🪨'],
      ['🪨', '🟫'],
    ];
    expect(parseMap(greenGrid)).toEqual(parseMap(brownGrid));
  });
});

describe('wrapPosition', () => {
  const map = parseMap([
    ['🟩', '🟩'],
    ['🟩', '🟩'],
  ]);

  it('reboucle une position en bordure haute vers 0', () => {
    expect(wrapPosition(map, { x: 0, y: 2 })).toEqual({ x: 0, y: 0 });
  });

  it('reboucle une position négative vers la dernière case de l’axe', () => {
    expect(wrapPosition(map, { x: -1, y: 0 })).toEqual({ x: 1, y: 0 });
  });

  it('laisse une position déjà dans les bornes inchangée', () => {
    expect(wrapPosition(map, { x: 1, y: 1 })).toEqual({ x: 1, y: 1 });
  });

  it('reboucle toute position vers (0,0) sur une carte 1×1', () => {
    const single = parseMap([['🟩']]);
    expect(wrapPosition(single, { x: 5, y: -3 })).toEqual({ x: 0, y: 0 });
  });
});
