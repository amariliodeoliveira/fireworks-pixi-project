import { Application, Container, Sprite } from "pixi.js";
import { loadFireworks } from "../utils/fireworksParser";
import {
  FountainFirework,
  RenderableFountain,
  ParticleType,
} from "../types/firework";
import { Vector2D } from "../utils/vector";
import { createCartesianContainer } from "../utils/createCartesianContainer";
import { updateParticles } from "./particles";

export async function addFountains(app: Application) {
  const fountainContainer = createCartesianContainer(app);
  const particleContainer = createCartesianContainer(app);
  app.stage.addChild(fountainContainer, particleContainer);

  const loadedFireworks = await loadFireworks();
  const fountains = loadedFireworks.fireworks.filter(
    (fw): fw is FountainFirework => fw.type === "Fountain"
  );

  fountains.forEach(({ position, duration, begin, colour }) => {
    setTimeout(() => {
      const fountain = Sprite.from("fountain") as RenderableFountain;
      fountain.anchor.set(0.5);
      fountain.blendMode = "add";
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
  const particlesPerFrame = 5;

  for (let i = 0; i < particlesPerFrame; i++) {
    const fountainConeAngle = Math.PI / 6;
    const angle = -Math.PI / 2 + (Math.random() * 2 - 1) * fountainConeAngle;
    const particleSpeed = 120 + Math.random() * 80;

    const particle = Sprite.from("particle") as ParticleType;
    particle.anchor.set(0.5);
    particle.x = fountain.x + (Math.random() - 0.5) * 20;
    particle.y = fountain.y;
    particle.tint = fountain.colour;
    particle.blendMode = "add";

    particle.velocity = Vector2D.fromAngle(angle, particleSpeed);
    particle.velocity.y = -particle.velocity.y;

    particle.gravity = 200;
    particle.life = 1.2 + Math.random() * 0.8;
    particle.startTime = performance.now();

    particleContainer.addChild(particle);
  }
}
