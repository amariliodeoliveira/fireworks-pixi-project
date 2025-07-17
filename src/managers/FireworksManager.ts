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
  private fireworksData: Firework[] = [];
  private displayDuration: number = 0;

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
    this.fireworksData = fireworksData.fireworks;
    this.calculateDisplayDuration();
    this.startFireworksDisplay();
    this.setupGameLoop();
  }

  private calculateDisplayDuration(): void {
    // Calculate total duration considering:
    // - Firework begin time + duration
    // - Extra time for particles to fade out after rockets explode
    // - Extra time for fountain particles to fade out

    const PARTICLE_FADE_TIME = 1500; // Max particle duration (1000 + 500)
    const FOUNTAIN_PARTICLE_FADE_TIME = 1200; // Max fountain particle duration (800 + 400)

    let maxDuration = 0;

    for (const firework of this.fireworksData) {
      const fireworkEndTime = firework.begin + firework.duration;

      if (firework.type === "Rocket") {
        // Rockets explode at the end and create particles that last up to 1.5s
        maxDuration = Math.max(
          maxDuration,
          fireworkEndTime + PARTICLE_FADE_TIME
        );
      } else if (firework.type === "Fountain") {
        // Fountains emit particles throughout their duration
        // Last particles are emitted at the end and fade over time
        maxDuration = Math.max(
          maxDuration,
          fireworkEndTime + FOUNTAIN_PARTICLE_FADE_TIME
        );
      }
    }

    this.displayDuration = maxDuration;
  }

  private startFireworksDisplay(): void {
    this.scheduleFireworks(this.fireworksData);

    // Schedule restart after display duration
    setTimeout(() => {
      this.restartDisplay();
    }, this.displayDuration);
  }

  private restartDisplay(): void {
    // Clear all existing entities
    this.entityManager.clear();

    // Restart the display
    this.startFireworksDisplay();
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

    // Clear any pending timeouts
    // Note: In a production app, we'd track timeout IDs to clear them properly
  }
}
