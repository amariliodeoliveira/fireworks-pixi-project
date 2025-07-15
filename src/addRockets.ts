import { Container, Sprite, Application } from "pixi.js";
import { loadFireworks } from "./utils/fireworksParser";
import { RocketFirework, RenderableRocket } from "./types/firework";
import { explodeParticles, updateParticles } from "./addParticles";
import { Time } from "./utils/time";

function createInvertedContainer(app: Application): Container {
  const container = new Container();
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  container.scale.y = -1;
  return container;
}

export async function addRockets(app: Application) {
  const rocketContainer = createInvertedContainer(app);
  const particleContainer = createInvertedContainer(app);
  app.stage.addChild(rocketContainer, particleContainer);

  const loadedFireworks = await loadFireworks();
  const rockets = loadedFireworks.fireworks.filter(
    (fw): fw is RocketFirework => fw.type === "Rocket"
  );

  rockets.forEach(({ position, velocity, duration, begin, colour }) => {
    setTimeout(() => {
      const rocket = Sprite.from("rocket") as RenderableRocket;
      rocket.anchor.set(0.5);
      rocket.blendMode = "add";
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
    const delta = Time.convert(app.ticker.deltaMS, "ms", "s");

    updateRockets(now, delta);
    updateParticles(particleContainer, delta, now);
  });

  function updateRockets(now: number, delta: number) {
    for (let i = rocketContainer.children.length - 1; i >= 0; i--) {
      const rocket = rocketContainer.children[i] as RenderableRocket;
      const isExpired = now - rocket.startTime >= rocket.duration;

      rocket.x += rocket.velocity.x * delta;
      rocket.y += rocket.velocity.y * delta;

      if (isExpired) {
        explodeParticles(particleContainer, rocket.position, rocket.colour);
        rocketContainer.removeChild(rocket);
        rocket.destroy();
      }
    }
  }
}
