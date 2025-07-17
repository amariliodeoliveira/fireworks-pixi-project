import { Application } from "pixi.js";
import { EntityManager } from "./EntityManager";
import { Time } from "../utils/time";

export class GameLoop {
  private app: Application;
  private entityManager: EntityManager;
  private isRunning: boolean = false;

  constructor(app: Application, entityManager: EntityManager) {
    this.app = app;
    this.entityManager = entityManager;
  }

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.app.ticker.add(this.gameLoop, this);
  }

  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.app.ticker.remove(this.gameLoop, this);
  }

  private gameLoop(): void {
    const currentTime = performance.now();
    const deltaTime = Time.convert(this.app.ticker.deltaMS, "ms", "s");

    this.entityManager.update(deltaTime, currentTime);
  }

  isGameRunning(): boolean {
    return this.isRunning;
  }
}
