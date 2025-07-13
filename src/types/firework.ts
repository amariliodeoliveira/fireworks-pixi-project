export interface Vector2D {
  x: number;
  y: number;
}

export type Position = Vector2D;
export type Velocity = Vector2D;

interface BaseFirework {
  begin: number;
  colour: number;
  duration: number;
  position: Position;
}

export interface FountainFirework extends BaseFirework {
  type: "Fountain";
}

export interface RocketFirework extends BaseFirework {
  type: "Rocket";
  velocity: Velocity;
}

export type Firework = FountainFirework | RocketFirework;
export type FireworkType = Firework["type"];

export interface FireworkDisplay {
  fireworks: Firework[];
}
