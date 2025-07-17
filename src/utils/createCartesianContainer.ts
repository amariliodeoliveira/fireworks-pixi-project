import { Application, Container } from "pixi.js";

interface CartesianContainerOptions {
  centerX?: number;
  centerY?: number;
  invertY?: boolean;
}

export function createCartesianContainer(
  app: Application,
  options: CartesianContainerOptions = {}
): Container {
  const container = new Container();

  const centerX = options.centerX ?? app.screen.width / 2;
  const centerY = options.centerY ?? app.screen.height / 2;
  const invertY = options.invertY ?? true;

  container.x = centerX;
  container.y = centerY;

  if (invertY) {
    container.scale.y = -1;
  }

  return container;
}
