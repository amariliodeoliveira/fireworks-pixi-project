import { Application, Container, Sprite } from "pixi.js";

import { PARTICLE_CONFIG, FOUNTAIN_CONFIG } from "@/config/particles";
import { VISUAL_CONFIG } from "@/config/visual";
import {
  FountainFirework,
  RenderableFountain,
  ParticleType,
  FireworkDisplay,
} from "@/types/firework";
import { createCartesianContainer } from "@/utils/createCartesianContainer";
import { Vector2D } from "@/utils/vector";

import { updateParticles } from "./particles";

export function addFountains(app: Application, fireworksData: FireworkDisplay) {
  const fountainContainer = createCartesianContainer(app);
  const particleContainer = createCartesianContainer(app);
  app.stage.addChild(fountainContainer, particleContainer);

  const fountains = fireworksData.fireworks.filter(
    (fw): fw is FountainFirework => fw.type === "Fountain"
  );

  fountains.forEach(({ position, duration, begin, colour }) => {
    setTimeout(() => {
      const fountain = Sprite.from("fountain") as RenderableFountain;
      fountain.anchor.set(0.5);
      fountain.blendMode = VISUAL_CONFIG.BLEND_MODE;
      fountain.tint = colour;
      fountain.x = position.x;
      fountain.y = position.y;
      fountain.duration = duration;
      fountain.startTime = performance.now();
      fountain.colour = colour;
      fountainContainer.addChild(fountain);
    }, begin);
  });

  app.ticker.add(() => {
    const now = performance.now();
    const deltaInSeconds = app.ticker.deltaMS / 1000;

    updateFountains(fountainContainer, particleContainer, now);
    updateParticles(particleContainer, deltaInSeconds, now);
  });
}

function updateFountains(
  fountainContainer: Container,
  particleContainer: Container,
  now: number
) {
  for (let i = fountainContainer.children.length - 1; i >= 0; i--) {
    const fountain = fountainContainer.children[i] as RenderableFountain;
    const isExpired = now - fountain.startTime >= fountain.duration;

    if (isExpired) {
      fountainContainer.removeChild(fountain);
      continue;
    }

    emitFountainParticles(particleContainer, fountain);
  }
}

function emitFountainParticles(
  particleContainer: Container,
  fountain: RenderableFountain
) {
  const particlesPerFrame = FOUNTAIN_CONFIG.PARTICLES_PER_FRAME;

  for (let i = 0; i < particlesPerFrame; i++) {
    const fountainConeAngle = FOUNTAIN_CONFIG.CONE_ANGLE;
    const angle = -Math.PI / 2 + (Math.random() * 2 - 1) * fountainConeAngle;
    const particleSpeed =
      FOUNTAIN_CONFIG.SPEED_MIN +
      Math.random() * (FOUNTAIN_CONFIG.SPEED_MAX - FOUNTAIN_CONFIG.SPEED_MIN);

    const particle = Sprite.from("particle") as ParticleType;
    particle.anchor.set(VISUAL_CONFIG.ANCHOR_CENTER);
    particle.x =
      fountain.x + (Math.random() - 0.5) * FOUNTAIN_CONFIG.SPAWN_RADIUS;
    particle.y = fountain.y;
    particle.tint = fountain.colour;
    particle.blendMode = VISUAL_CONFIG.BLEND_MODE;

    particle.velocity = Vector2D.fromAngle(angle, particleSpeed);
    particle.velocity.y = -particle.velocity.y;

    particle.gravity = FOUNTAIN_CONFIG.GRAVITY;
    particle.life =
      PARTICLE_CONFIG.FOUNTAIN_LIFETIME_MIN +
      Math.random() *
        (PARTICLE_CONFIG.FOUNTAIN_LIFETIME_MAX -
          PARTICLE_CONFIG.FOUNTAIN_LIFETIME_MIN);
    particle.startTime = performance.now();

    particleContainer.addChild(particle);
  }
}
