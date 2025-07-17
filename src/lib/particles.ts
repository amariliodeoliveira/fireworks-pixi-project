import { Container, Sprite, Texture, ColorSource } from "pixi.js";
import { ParticleType } from "../types/firework";
import { Vector2D } from "../utils/vector";

export function createParticle(
  texture: Texture,
  position: Vector2D,
  colour: ColorSource,
  velocity: Vector2D
): ParticleType {
  const particle = new Sprite(texture) as ParticleType;
  particle.anchor.set(0.5);
  particle.x = position.x;
  particle.y = position.y;
  particle.tint = colour;
  particle.blendMode = "add";

  particle.velocity = velocity;
  particle.gravity = 300;
  particle.life = 1.5 + Math.random() * 0.5;
  particle.startTime = performance.now();

  return particle;
}

export function explodeParticles(
  container: Container,
  position: Vector2D,
  colour: ColorSource
) {
  const texture = Texture.from("particle");
  const particleCount = 20 + Math.floor(Math.random() * 31);

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 100 + Math.random() * 200;

    const velocity = Vector2D.fromAngle(angle, speed);

    const particle = createParticle(texture, position, colour, velocity);
    container.addChild(particle);
  }
}

export function updateParticles(
  container: Container,
  delta: number,
  now: number
) {
  for (let i = container.children.length - 1; i >= 0; i--) {
    const particle = container.children[i] as ParticleType;
    const age = (now - particle.startTime) / 1000;

    if (age > particle.life) {
      container.removeChild(particle);
      continue;
    }

    particle.x += particle.velocity.x * delta;
    particle.y += particle.velocity.y * delta;

    particle.velocity.y += particle.gravity * delta;

    const lifeRatio = age / particle.life;
    particle.alpha = Math.max(0, 1 - lifeRatio);
  }
}
