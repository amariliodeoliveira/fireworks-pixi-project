import { Application, Assets } from "pixi.js";
import { FireworksManager } from "./managers/FireworksManager";

const app = new Application();
let fireworksManager: FireworksManager;

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

  fireworksManager = new FireworksManager(app);
  await fireworksManager.initialize();
})();
