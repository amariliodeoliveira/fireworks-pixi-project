import { Application, Assets } from "pixi.js";

import { addBunny } from "./addBunny";
import { addRockets } from "./addRockets";

const app = new Application();

async function setup() {
  const container = document.getElementById("pixi-container");
  if (!container) throw new Error("Container element not found");

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
    { alias: "bunny", src: "/assets/bunny.png" },
  ]);
}

(async () => {
  await setup();
  await preload();

  addBunny(app);
  addRockets(app);
})();
