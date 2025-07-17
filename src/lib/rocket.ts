import { Application, Container, Sprite } from "pixi.js";
import { loadFireworks } from "../utils/fireworksParser";
import { RocketFirework, RenderableRocket } from "../types/firework";
import { Vector2D } from "../utils/vector";
import { createCartesianContainer } from "../utils/createCartesianContainer";
import { explodeParticles, updateParticles } from "./particles";

export async function addRockets(app: Application) {
  const rocketContainer = createCartesianContainer(app);
  const particleContainer = createCartesianContainer(app);
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
    const deltaInSeconds = app.ticker.deltaMS / 1000;

    updateRockets(rocketContainer, particleContainer, now, deltaInSeconds);
    updateParticles(particleContainer, deltaInSeconds, now);
  });
}

function updateRockets(
  rocketContainer: Container,
  particleContainer: Container,
  now: number,
  delta: number
) {
  for (let i = rocketContainer.children.length - 1; i >= 0; i--) {
    const rocket = rocketContainer.children[i] as RenderableRocket;
    const isExpired = now - rocket.startTime >= rocket.duration;

    rocket.x += rocket.velocity.x * delta;
    rocket.y += rocket.velocity.y * delta;

    if (isExpired) {
      explodeParticles(particleContainer, Vector2D.copy(rocket), rocket.colour);
      rocketContainer.removeChild(rocket);
    }
  }
}
