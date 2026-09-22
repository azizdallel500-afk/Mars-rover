import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulateRover } from '../src/index.js';
import type { Command, Direction } from '../src/types.js';

interface DemoScenario {
  start: { x: number; y: number };
  direction: Direction;
  map: string[][];
  commands: Command[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const exampleDir = join(__dirname, '..', 'examples');
const examplePath = join(exampleDir, 'demo-scenario.json');

// Scénario repris de EX-07 (spec.md) : (0,0,N) + [avancer, avancer, tourner à droite, avancer] → (1,2,E).
const defaultScenario: DemoScenario = {
  start: { x: 0, y: 0 },
  direction: 'N',
  map: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => '🟩')),
  commands: ['ADVANCE', 'ADVANCE', 'TURN_RIGHT', 'ADVANCE'],
};

if (!existsSync(examplePath)) {
  mkdirSync(exampleDir, { recursive: true });
  writeFileSync(examplePath, `${JSON.stringify(defaultScenario, null, 2)}\n`, 'utf8');
  console.log(`Fichier d'exemple créé : ${examplePath}`);
}

const scenario: DemoScenario = JSON.parse(readFileSync(examplePath, 'utf8'));
const result = simulateRover(scenario.start, scenario.direction, scenario.map, scenario.commands);
const [x, y, direction] = result.split(' ');

console.log(`Position finale : (${x}, ${y})`);
console.log(`Orientation finale : ${direction}`);
