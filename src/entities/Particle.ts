import { Sprite, Texture, ColorSource } from "pixi.js";
import { Entity } from "../core/Entity";
import { Vector2D } from "../types/firework";

export class Particle extends Entity {
  private velocity: Vector2D;
  private readonly gravity: number = 200; // pixels/second²

  constructor(
    position: Vector2D,
    velocity: Vector2D,
    colour: ColorSource,
    duration: number = 1000 + Math.random() * 500
  ) {
    const texture = Texture.from("particle");
    const sprite = new Sprite(texture);

    super(sprite, duration, colour, "particle");

    this.velocity = velocity;
    this.position = position;
  }

  update(deltaTime: number): void {
    // Apply velocity
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;

    // Apply gravity
    this.velocity.y += this.gravity * deltaTime;

    // Optional: Add fade effect based on lifetime
    const elapsedTime = performance.now() - this.startTime;
    const lifetimeRatio = elapsedTime / this.duration;
    this.sprite.alpha = Math.max(0, 1 - lifetimeRatio);
  }

  static createExplosion(
    position: Vector2D,
    colour: ColorSource,
    count: number = 20 + Math.random() * 30
  ): Particle[] {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;

      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      particles.push(new Particle(position, velocity, colour));
    }

    return particles;
  }

  static createFountainParticle(
    position: Vector2D,
    colour: ColorSource,
    coneAngle: number = Math.PI / 6
  ): Particle {
    const angle = -Math.PI / 2 + (Math.random() * 2 - 1) * coneAngle;
    const speed = 150 + Math.random() * 100;

    const velocity = {
      x: Math.cos(angle) * speed,
      y: -Math.sin(angle) * speed,
    };

    return new Particle(position, velocity, colour, 800 + Math.random() * 400);
  }
}
