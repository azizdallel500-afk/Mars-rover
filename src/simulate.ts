import { deltaFor, turnLeft, turnRight } from './direction.js';
import { isObstacle, wrapPosition } from './map.js';
import type { Command, Direction, MapModel, Position, RoverState } from './types.js';

function advance(state: RoverState, map: MapModel): RoverState {
  const delta = deltaFor(state.direction);
  const rawPosition: Position = {
    x: state.position.x + delta.x,
    y: state.position.y + delta.y,
  };
  const wrapped = wrapPosition(map, rawPosition);
  if (isObstacle(map, wrapped)) {
    return state;
  }
  return { position: wrapped, direction: state.direction };
}

export function simulate(
  start: Position,
  initialDirection: Direction,
  map: MapModel,
  commands: readonly Command[],
): RoverState {
  let state: RoverState = { position: { ...start }, direction: initialDirection };
  for (const command of commands) {
    switch (command) {
      case 'ADVANCE':
        state = advance(state, map);
        break;
      case 'TURN_RIGHT':
        state = { position: state.position, direction: turnRight(state.direction) };
        break;
      case 'TURN_LEFT':
        state = { position: state.position, direction: turnLeft(state.direction) };
        break;
    }
  }
  return state;
}
