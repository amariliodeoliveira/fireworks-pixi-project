import { Application, Assets } from "pixi.js";
import { loadFireworks } from "./services/fireworksService";
import { startFireworkLoop } from "./services/showService";

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
  try {
    await setup();
    await preload();

    const fireworksData = await loadFireworks();
    startFireworkLoop(app, fireworksData);
  } catch (error) {
    console.error("Error starting application:", error);
  }
})();
