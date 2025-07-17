import { Application, Assets } from "pixi.js";
import { addRockets } from "./lib/rocket";
import { addFountains } from "./lib/fountain";

const app = new Application();

async function setup() {
  const container = document.getElementById("pixi-container") as HTMLElement;

  await app.init({
    backgroundColor: 0x000000,
    width: 1024,
    height: 768,
    resizeTo: window,
  });

  container.innerHTML = "";
  container.appendChild(app.canvas);
}

async function preload() {
  await Assets.load([
    { alias: "rocket", src: "/assets/rocket.png" },
    { alias: "particle", src: "/assets/particle.png" },
    { alias: "fountain", src: "/assets/fountain.png" },
  ]);
}

(async () => {
  await setup();
  await preload();

  // Start firework systems
  addRockets(app);
  addFountains(app);
})();
