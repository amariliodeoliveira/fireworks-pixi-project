import { Sprite, ColorSource } from "pixi.js";
import { Entity } from "../core/Entity";
import { Vector2D } from "../types/firework";

export class Rocket extends Entity {
  private velocity: Vector2D;

  constructor(
    position: Vector2D,
    velocity: Vector2D,
    colour: ColorSource,
    duration: number
  ) {
    const sprite = Sprite.from("rocket");
    super(sprite, duration, colour, "rocket");

    this.velocity = velocity;
    this.position = position;
  }

  update(deltaTime: number): void {
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;
  }

  getVelocity(): Vector2D {
    return { ...this.velocity };
  }
}
