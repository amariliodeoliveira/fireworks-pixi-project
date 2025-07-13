import { Container, Sprite, Application, Texture } from "pixi.js";
import { loadFireworks } from "./utils/fireworksParser";
import { RocketType } from "./types/pixi";
import { RocketFirework } from "./types/firework";

interface ParticleType extends Sprite {
  velocity: { x: number; y: number };
  duration: number;
  startTime: number;
}

function createInvertedContainer(app: Application) {
  const container = new Container();
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  container.scale.y = -1;
  return container;
}

function createParticle(
  texture: Texture,
  x: number,
  y: number,
  colour: number
): ParticleType {
  const particle = new Sprite(texture) as ParticleType;
  particle.anchor.set(0.5);
  particle.x = x;
  particle.y = y;

  particle.blendMode = "add";
  particle.tint = colour;

  const angle = Math.random() * Math.PI * 2;
  const speed = 100 + Math.random() * 200;

  particle.velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
  particle.duration = 1000 + Math.random() * 500;
  particle.startTime = performance.now();

  return particle;
}

export async function addRockets(app: Application) {
  const rocketContainer = createInvertedContainer(app);
  const particleContainer = createInvertedContainer(app);
  app.stage.addChild(rocketContainer, particleContainer);

  const loadedFireworks = await loadFireworks();
  const rockets = loadedFireworks.fireworks.filter(
    (fw): fw is RocketFirework => fw.type === "Rocket"
  );

  const particleTexture = Sprite.from("particle").texture;

  rockets.forEach(({ position, velocity, duration, begin, colour }) => {
    setTimeout(() => {
      const rocket = Sprite.from("rocket") as RocketType;
      rocket.blendMode = "add";
      rocket.anchor.set(0.5);
      rocket.tint = colour;
      rocket.colour = colour;
      rocket.x = position.x;
      rocket.y = position.y;
      rocket.velocity = velocity;
      rocket.duration = duration;
      rocket.startTime = performance.now();
      rocketContainer.addChild(rocket);
    }, begin);
  });

  app.ticker.add(() => {
    const now = performance.now();
    const delta = app.ticker.deltaMS / 1000;

    for (let i = rocketContainer.children.length - 1; i >= 0; i--) {
      const rocket = rocketContainer.children[i] as RocketType;
      rocket.x += rocket.velocity.x * delta;
      rocket.y += rocket.velocity.y * delta;

      if (now - rocket.startTime >= rocket.duration) {
        explode(rocket.x, rocket.y, rocket.colour);
        rocketContainer.removeChild(rocket);
        rocket.destroy();
      }
    }

    for (let i = particleContainer.children.length - 1; i >= 0; i--) {
      const particle = particleContainer.children[i] as ParticleType;
      particle.x += particle.velocity.x * delta;
      particle.y += particle.velocity.y * delta;

      if (now - particle.startTime >= particle.duration) {
        particleContainer.removeChild(particle);
        particle.destroy();
      }
    }
  });

  function explode(x: number, y: number, colour: RocketFirework["colour"]) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const particle = createParticle(particleTexture, x, y, colour);
      particleContainer.addChild(particle);
    }
  }
}
