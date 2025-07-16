import { Application, Container, ColorSource } from "pixi.js";
import { loadFireworks } from "./utils/fireworksParser";
import {
  FountainFirework,
  ParticleType,
  RenderableFountain,
} from "./types/firework";
import { updateParticles } from "./addParticles";
import { Time } from "./utils/time";

export async function addFountains(app: Application) {
  const fountainContainer = createInvertedContainer(app);
  const particleContainer = createInvertedContainer(app);
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
      fountainContainer.addChild(fountain);
    }, begin);
  });

  app.ticker.add(() => {
    const now = performance.now();
    const delta = Time.convert(app.ticker.deltaMS, "ms", "s");

    updateFountains(fountainContainer, particleContainer, now);
    updateParticles(particleContainer, delta, now);
  });
}

function updateFountains(
  fountainContainer: Container,
  particleContainer: Container,
  now: number
) {
  for (let i = fountainContainer.children.length - 1; i >= 0; i--) {
    const fountain = fountainContainer.children[i] as RenderableFountain;
    emitFountainParticles(particleContainer, fountain);

    const expired = now - fountain.startTime >= fountain.duration;
    if (expired) {
      fountainContainer.removeChild(fountain);
      fountain.destroy();
    }
  }
}

function emitFountainParticles(
  particleContainer: Container,
  fountain: RenderableFountain
) {
  const particlesPerFrame = 5;

  for (let i = 0; i < particlesPerFrame; i++) {
    const coneAngle = Math.PI / 6;
    const angle = -Math.PI / 2 + (Math.random() * 2 - 1) * coneAngle;
    const speed = 150 + Math.random() * 100;

    const velocity = {
      x: Math.cos(angle) * speed,
      y: -Math.sin(angle) * speed,
    };

    const particle = createParticleWithVelocity(
      fountain.x,
      fountain.y,
      fountain.tint,
      velocity
    );
    particleContainer.addChild(particle);
  }
}

// Função que cria a partícula com a velocidade já definida
import { Sprite, Texture } from "pixi.js";
import { createInvertedContainer } from "./utils/createInvertedContainer";

function createParticleWithVelocity(
  x: number,
  y: number,
  colour: ColorSource,
  velocity: { x: number; y: number }
) {
  const texture = Texture.from("particle");

  const particle = new Sprite(texture) as ParticleType;
  particle.anchor.set(0.5);
  particle.x = x;
  particle.y = y;
  particle.blendMode = "add";
  particle.tint = colour;

  particle.velocity = velocity;
  particle.duration = 800 + Math.random() * 400;
  particle.startTime = performance.now();

  return particle;
}
