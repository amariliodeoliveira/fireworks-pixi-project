import { Container, Sprite, Texture, ColorSource } from "pixi.js";
import { ParticleType } from "../types/firework";
import { Vector2D } from "../utils/vector";
import { PARTICLE_CONFIG, EXPLOSION_CONFIG } from "../config/particles";
import { VISUAL_CONFIG } from "../config/visual";

export function createParticle(
  texture: Texture,
  position: Vector2D,
  colour: ColorSource,
  velocity: Vector2D
): ParticleType {
  const particle = Sprite.from(texture) as ParticleType;
  particle.anchor.set(VISUAL_CONFIG.ANCHOR_CENTER);
  particle.x = position.x;
  particle.y = position.y;
  particle.tint = colour;
  particle.blendMode = VISUAL_CONFIG.BLEND_MODE;

  particle.velocity = velocity;
  particle.gravity = EXPLOSION_CONFIG.GRAVITY;
  particle.life =
    PARTICLE_CONFIG.EXPLOSION_LIFETIME_MIN +
    Math.random() *
      (PARTICLE_CONFIG.EXPLOSION_LIFETIME_MAX -
        PARTICLE_CONFIG.EXPLOSION_LIFETIME_MIN);
  particle.startTime = performance.now();

  return particle;
}

export function explodeParticles(
  container: Container,
  position: Vector2D,
  colour: ColorSource
) {
  const texture = Texture.from("particle");
  const particleCount =
    EXPLOSION_CONFIG.PARTICLE_COUNT_MIN +
    Math.floor(
      Math.random() *
        (EXPLOSION_CONFIG.PARTICLE_COUNT_MAX -
          EXPLOSION_CONFIG.PARTICLE_COUNT_MIN)
    );

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed =
      EXPLOSION_CONFIG.SPEED_MIN +
      Math.random() * (EXPLOSION_CONFIG.SPEED_MAX - EXPLOSION_CONFIG.SPEED_MIN);

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
