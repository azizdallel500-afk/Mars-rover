import { describe, expect, it } from 'vitest';
import { parseMap } from '../src/map.js';
import { simulate } from '../src/simulate.js';
import type { Command } from '../src/types.js';

function freeGrid(width: number, height: number): string[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => '🟩'));
}

describe('EX-01 — initialisation du rover', () => {
  it('retourne le point de départ inchangé sans commande', () => {
    const map = parseMap(freeGrid(5, 5));
    const state = simulate({ x: 2, y: 3 }, 'N', map, []);
    expect(state).toEqual({ position: { x: 2, y: 3 }, direction: 'N' });
  });
});

describe('EX-03 — avancer d’une case', () => {
  it('avance vers une case libre sans changer de direction', () => {
    const map = parseMap(freeGrid(5, 5));
    const state = simulate({ x: 2, y: 3 }, 'N', map, ['ADVANCE']);
    expect(state).toEqual({ position: { x: 2, y: 4 }, direction: 'N' });
  });
});

describe('EX-04 — tourner à droite', () => {
  it('pivote sans changer de position', () => {
    const map = parseMap(freeGrid(5, 5));
    const state = simulate({ x: 2, y: 3 }, 'N', map, ['TURN_RIGHT']);
    expect(state).toEqual({ position: { x: 2, y: 3 }, direction: 'E' });
  });
});

describe('EX-05 — tourner à gauche', () => {
  it('pivote sans changer de position', () => {
    const map = parseMap(freeGrid(5, 5));
    const state = simulate({ x: 2, y: 3 }, 'N', map, ['TURN_LEFT']);
    expect(state).toEqual({ position: { x: 2, y: 3 }, direction: 'W' });
  });
});

describe('EX-06 — blocage sur obstacle', () => {
  it('reste immobile sur la commande bloquée puis poursuit normalement', () => {
    const grid = freeGrid(5, 5);
    grid[4][2] = '🌳'; // case (2,4)
    const map = parseMap(grid);
    const state = simulate({ x: 2, y: 3 }, 'N', map, ['ADVANCE', 'TURN_RIGHT']);
    expect(state).toEqual({ position: { x: 2, y: 3 }, direction: 'E' });
  });
});

describe('EX-07 — exécution séquentielle d’une liste de commandes', () => {
  it('applique chaque commande à l’état résultant de la précédente', () => {
    const map = parseMap(freeGrid(5, 5));
    const state = simulate({ x: 0, y: 0 }, 'N', map, ['ADVANCE', 'ADVANCE', 'TURN_RIGHT', 'ADVANCE']);
    expect(state).toEqual({ position: { x: 1, y: 2 }, direction: 'E' });
  });
});

describe('EX-09 — comportement en bord de carte', () => {
  it('reboucle vers le bord opposé sur le même axe, en conservant la direction', () => {
    const map = parseMap(freeGrid(5, 5));
    const state = simulate({ x: 4, y: 3 }, 'E', map, ['ADVANCE']);
    expect(state).toEqual({ position: { x: 0, y: 3 }, direction: 'E' });
  });

  it('reboucle sur chacun des 4 bords', () => {
    const map = parseMap(freeGrid(5, 5));
    expect(simulate({ x: 2, y: 4 }, 'N', map, ['ADVANCE'])).toEqual({ position: { x: 2, y: 0 }, direction: 'N' });
    expect(simulate({ x: 2, y: 0 }, 'S', map, ['ADVANCE'])).toEqual({ position: { x: 2, y: 4 }, direction: 'S' });
    expect(simulate({ x: 4, y: 2 }, 'E', map, ['ADVANCE'])).toEqual({ position: { x: 0, y: 2 }, direction: 'E' });
    expect(simulate({ x: 0, y: 2 }, 'W', map, ['ADVANCE'])).toEqual({ position: { x: 4, y: 2 }, direction: 'W' });
  });

  it('combine rebouclage et obstacle (EX-09 + EX-06) : la case rebouclée est occupée', () => {
    const grid = freeGrid(5, 5);
    grid[3][0] = '🌳'; // case d’arrivée après rebouclage, (0,3)
    const map = parseMap(grid);
    const state = simulate({ x: 4, y: 3 }, 'E', map, ['ADVANCE']);
    expect(state).toEqual({ position: { x: 4, y: 3 }, direction: 'E' });
  });

  it('laisse le rover sur son unique case dans une carte 1×1', () => {
    const map = parseMap([['🟩']]);
    const state = simulate({ x: 0, y: 0 }, 'N', map, ['ADVANCE', 'ADVANCE', 'ADVANCE']);
    expect(state).toEqual({ position: { x: 0, y: 0 }, direction: 'N' });
  });
});

describe('rotations seules', () => {
  it('ne déclenchent jamais de rebouclage ni de vérification d’obstacle', () => {
    const grid = freeGrid(2, 2);
    grid[0][0] = '🌳'; // case (0,0), non concernée : seules des rotations sont jouées
    const map = parseMap(grid);
    const state = simulate({ x: 0, y: 1 }, 'N', map, ['TURN_RIGHT', 'TURN_LEFT', 'TURN_LEFT']);
    expect(state).toEqual({ position: { x: 0, y: 1 }, direction: 'W' });
  });
});

describe('trajet mêlant plusieurs obstacles et commandes bloquées/libres', () => {
  it('applique blocages et déplacements successifs sur une séquence longue', () => {
    const grid = freeGrid(5, 5);
    grid[4][2] = '🌳'; // case (2,4) : bloque la première avancée
    const map = parseMap(grid);
    const commands: Command[] = [
      'ADVANCE', // bloqué par (2,4) → reste (2,3) N
      'TURN_RIGHT', // (2,3) E
      'ADVANCE', // (3,3) E
      'ADVANCE', // (4,3) E
      'TURN_RIGHT', // (4,3) S
      'ADVANCE', // (4,2) S
      'TURN_LEFT', // (4,2) E
      'ADVANCE', // rebouclage (5,2)→(0,2) E
    ];
    const state = simulate({ x: 2, y: 3 }, 'N', map, commands);
    expect(state).toEqual({ position: { x: 0, y: 2 }, direction: 'E' });
  });
});

describe('pureté de la fonction', () => {
  it('produit le même résultat pour les mêmes entrées, sans les muter', () => {
    const grid = freeGrid(3, 3);
    const map = parseMap(grid);
    const start = { x: 0, y: 0 };
    const startCopy = { ...start };
    const commands: Command[] = ['ADVANCE', 'TURN_RIGHT', 'ADVANCE'];
    const commandsCopy = [...commands];

    const first = simulate(start, 'N', map, commands);
    const second = simulate(start, 'N', map, commands);

    expect(first).toEqual(second);
    expect(start).toEqual(startCopy);
    expect(commands).toEqual(commandsCopy);
  });
});

describe('équivalence stricte des deux jeux de symboles', () => {
  it('rejoue EX-07 encodé en 🟫/🪨 avec un résultat identique', () => {
    const grid = freeGrid(5, 5).map((row) => row.map(() => '🟫'));
    const map = parseMap(grid);
    const state = simulate({ x: 0, y: 0 }, 'N', map, ['ADVANCE', 'ADVANCE', 'TURN_RIGHT', 'ADVANCE']);
    expect(state).toEqual({ position: { x: 1, y: 2 }, direction: 'E' });
  });
});
