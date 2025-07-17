import { EntityManager } from "../core/EntityManager";
import { Entity } from "../core/Entity";
import { Fountain } from "../entities/Fountain";
import { Particle } from "../entities/Particle";
import { Rocket } from "../entities/Rocket";

export class ParticleSystem {
  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;

    // Register callback to handle entity removal
    this.entityManager.onEntityRemoved((entity) => {
      this.handleEntityRemoved(entity);
    });
  }

  update(): void {
    this.handleFountainParticles();
    // Rocket explosions are now handled by the removal callback
  }

  private handleEntityRemoved(entity: Entity): void {
    if (entity.entityType === "rocket") {
      this.explodeRocket(entity as Rocket);
    }
  }

  private handleFountainParticles(): void {
    const fountains =
      this.entityManager.getEntitiesByType<Fountain>("fountain");

    for (const fountain of fountains) {
      if (fountain.shouldEmitParticles()) {
        this.emitFountainParticles(fountain);
      }
    }
  }

  private emitFountainParticles(fountain: Fountain): void {
    const particleCount = fountain.getParticleEmissionRate();

    for (let i = 0; i < particleCount; i++) {
      const particle = Particle.createFountainParticle(
        fountain.position,
        fountain.colour
      );
      this.entityManager.addEntity(particle, "particles");
    }
  }

  private explodeRocket(rocket: Rocket): void {
    const explosionParticles = Particle.createExplosion(
      rocket.position,
      rocket.colour
    );

    for (const particle of explosionParticles) {
      this.entityManager.addEntity(particle, "particles");
    }
  }
}
