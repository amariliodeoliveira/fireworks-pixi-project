import type { Sprite } from "pixi.js";
import { Velocity } from "./firework";

export interface RocketType extends Sprite {
  velocity: Velocity;
  duration: number;
  startTime: number;
  colour: number;
}
