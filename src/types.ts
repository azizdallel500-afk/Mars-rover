export type Direction = 'N' | 'E' | 'S' | 'W';

export type Command = 'ADVANCE' | 'TURN_RIGHT' | 'TURN_LEFT';

export type Cell = 'FREE' | 'OBSTACLE';

export interface Position {
  x: number;
  y: number;
}

export interface MapModel {
  width: number;
  height: number;
  grid: Cell[][];
}

export interface RoverState {
  position: Position;
  direction: Direction;
}
