import { ColorSource, Sprite } from 'pixi.js';
import { Vector2D } from '@/utils/vector';

interface BaseFirework {
  readonly begin: number;
  readonly colour: ColorSource;
  readonly duration: number;
  readonly position: Vector2D;
}

export interface FountainFirework extends BaseFirework {
  readonly type: 'Fountain';
}

export interface RocketFirework extends BaseFirework {
  readonly type: 'Rocket';
  readonly velocity: Vector2D;
}

export type Firework = FountainFirework | RocketFirework;
export type FireworkType = Firework['type'];

export interface FireworkDisplay {
  readonly fireworks: readonly Firework[];
}

interface RenderableFirework {
  startTime: number;
  duration: number;
  colour: ColorSource;
}

export type RenderableRocket = Sprite &
  RenderableFirework & {
    velocity: Vector2D;
  };

export type RenderableFountain = Sprite & RenderableFirework;

export interface ParticleType extends Sprite {
  velocity: Vector2D;
  gravity: number;
  life: number;
  startTime: number;
}
