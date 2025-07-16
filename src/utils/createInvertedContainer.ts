import { Application, Container } from "pixi.js";

export function createInvertedContainer(app: Application): Container {
  const container = new Container();
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  container.scale.y = -1;
  return container;
}
