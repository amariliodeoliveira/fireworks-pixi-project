import { Application } from "pixi.js";
import { EntityManager } from "../core/EntityManager";
import { GameLoop } from "../core/GameLoop";
import { ParticleSystem } from "../systems/ParticleSystem";
import { FireworkFactory } from "../factories/FireworkFactory";
import { createInvertedContainer } from "../utils/createInvertedContainer";
import { loadFireworks } from "../utils/fireworksParser";
import {
  Firework,
  isFountainFirework,
  isRocketFirework,
} from "../types/firework";

export class FireworksManager {
  private app: Application;
  private entityManager: EntityManager;
  private gameLoop: GameLoop;
  private particleSystem: ParticleSystem;

  constructor(app: Application) {
    this.app = app;
    this.entityManager = new EntityManager();
    this.gameLoop = new GameLoop(app, this.entityManager);
    this.particleSystem = new ParticleSystem(this.entityManager);

    this.setupContainers();
  }

  private setupContainers(): void {
    const rocketContainer = createInvertedContainer(this.app);
    const fountainContainer = createInvertedContainer(this.app);
    const particleContainer = createInvertedContainer(this.app);

    this.app.stage.addChild(
      rocketContainer,
      fountainContainer,
      particleContainer
    );

    this.entityManager.registerContainer("rockets", rocketContainer);
    this.entityManager.registerContainer("fountains", fountainContainer);
    this.entityManager.registerContainer("particles", particleContainer);
  }

  async initialize(): Promise<void> {
    const fireworksData = await loadFireworks();
    this.scheduleFireworks(fireworksData.fireworks);
    this.setupGameLoop();
  }

  private scheduleFireworks(fireworks: Firework[]): void {
    fireworks.forEach((firework) => {
      setTimeout(() => {
        if (isFountainFirework(firework)) {
          const fountain = FireworkFactory.createFountain(firework);
          this.entityManager.addEntity(fountain, "fountains");
        } else if (isRocketFirework(firework)) {
          const rocket = FireworkFactory.createRocket(firework);
          this.entityManager.addEntity(rocket, "rockets");
        }
      }, firework.begin);
    });
  }

  private setupGameLoop(): void {
    // Override the update method to include our particle system
    const originalUpdate = this.entityManager.update.bind(this.entityManager);
    this.entityManager.update = (deltaTime: number, currentTime: number) => {
      originalUpdate(deltaTime, currentTime);
      this.particleSystem.update();
    };

    this.gameLoop.start();
  }

  stop(): void {
    this.gameLoop.stop();
    this.entityManager.clear();
  }
}
