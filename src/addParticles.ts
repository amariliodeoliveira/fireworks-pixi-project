import { Container, Sprite, Texture, ColorSource } from "pixi.js";
import { Vector2D } from "./types/firework";
import { getRandomInt } from "./utils/math";

interface ParticleType extends Sprite {
  velocity: Vector2D;
  duration: number;
  startTime: number;
}

export function explodeParticles(
  container: Container,
  position: Vector2D,
  colour: ColorSource
) {
  const texture = Texture.from("particle");
  const count = getRandomInt(20, 50);

  for (let i = 0; i < count; i++) {
    const particle = createParticle(texture, position, colour);
    container.addChild(particle);
  }
}

function createParticle(
  texture: Texture,
  position: Vector2D,
  colour: ColorSource
): ParticleType {
  const angle = Math.random() * Math.PI * 2;
  const speed = 100 + Math.random() * 200;

  const particle = new Sprite(texture) as ParticleType;
  particle.anchor.set(0.5);
  particle.x = position.x;
  particle.y = position.y;
  particle.blendMode = "add";
  particle.tint = colour;
  particle.velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
  particle.duration = 1000 + Math.random() * 500;
  particle.startTime = performance.now();
  return particle;
}

export function updateParticles(
  container: Container,
  delta: number,
  now: number
) {
  for (let i = container.children.length - 1; i >= 0; i--) {
    const particle = container.children[i] as ParticleType;
    particle.x += particle.velocity.x * delta;
    particle.y += particle.velocity.y * delta;

    if (now - particle.startTime >= particle.duration) {
      container.removeChild(particle);
      particle.destroy();
    }
  }
}
