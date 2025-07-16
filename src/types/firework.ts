import { ColorSource, Sprite } from "pixi.js";

export interface Vector2D {
  x: number;
  y: number;
}

export type Position = Vector2D;
export type Velocity = Vector2D;

interface BaseFirework {
  begin: number;
  colour: ColorSource;
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

export type RenderableRocket = Sprite & {
  startTime: number;
  velocity: Velocity;
  duration: number;
  colour: ColorSource;
};

export type RenderableFountain = Sprite & {
  startTime: number;
  duration: number;
  colour: ColorSource;
};

export type Firework = FountainFirework | RocketFirework;
export type FireworkType = Firework["type"];

export interface FireworkDisplay {
  fireworks: Firework[];
}

export interface ParticleType extends Sprite {
  velocity: Vector2D;
  duration: number;
  startTime: number;
}
