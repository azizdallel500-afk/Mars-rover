import type { RoverState } from './types.js';

export function formatResult(state: RoverState): string {
  return `${state.position.x} ${state.position.y} ${state.direction}`;
}
