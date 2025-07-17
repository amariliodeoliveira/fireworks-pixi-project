import { Sprite, ColorSource } from "pixi.js";
import { Entity } from "../core/Entity";
import { Vector2D } from "../types/firework";

export class Fountain extends Entity {
  private particleEmissionRate: number;

  constructor(
    position: Vector2D,
    colour: ColorSource,
    duration: number,
    particleEmissionRate: number = 5 // particles per frame
  ) {
    const sprite = Sprite.from("fountain");
    super(sprite, duration, colour, "fountain");

    this.position = position;
    this.particleEmissionRate = particleEmissionRate;
  }

  update(): void {
    // Fountain sprites don't move, they just exist and emit particles
    // The particle emission logic will be handled by the system
  }

  shouldEmitParticles(): boolean {
    // Emit particles every frame for now
    return true;
  }

  getParticleEmissionRate(): number {
    return this.particleEmissionRate;
  }
}
