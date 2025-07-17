import type { Application } from "pixi.js";
import { addRockets } from "../lib/rocket";
import { addFountains } from "../lib/fountain";
import type { FireworkDisplay } from "../types/firework";
import { MAX_PARTICLE_LIFETIME } from "../config/particles";

let showDuration = 0;
let showStartTime = 0;

function calculateShowDuration(fireworksData: FireworkDisplay): number {
  let maxEndTime = 0;

  for (const firework of fireworksData.fireworks) {
    const endTime = firework.begin + firework.duration;
    if (endTime > maxEndTime) {
      maxEndTime = endTime;
    }
  }

  const particleCleanupBuffer = MAX_PARTICLE_LIFETIME;
  return maxEndTime + particleCleanupBuffer;
}

function startShow(app: Application, fireworksData: FireworkDisplay) {
  app.stage.removeChildren();
  showStartTime = performance.now();
  addRockets(app, fireworksData);
  addFountains(app, fireworksData);
}

function checkRestart(app: Application, fireworksData: FireworkDisplay) {
  const elapsed = performance.now() - showStartTime;

  if (elapsed >= showDuration) {
    startShow(app, fireworksData);
  }
}

export function startFireworkLoop(
  app: Application,
  fireworksData: FireworkDisplay
) {
  showDuration = calculateShowDuration(fireworksData);
  startShow(app, fireworksData);
  app.ticker.add(() => checkRestart(app, fireworksData));
}
