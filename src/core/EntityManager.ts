import { Container } from "pixi.js";
import { Entity } from "./Entity";

export class EntityManager {
  private entities: Set<Entity> = new Set();
  private containersMap: Map<string, Container> = new Map();
  private onEntityRemovedCallbacks: ((entity: Entity) => void)[] = [];

  addEntity(entity: Entity, containerName: string): void {
    this.entities.add(entity);
    const container = this.containersMap.get(containerName);
    if (container) {
      container.addChild(entity.displayObject);
    }
  }

  removeEntity(entity: Entity): void {
    this.entities.delete(entity);
    if (entity.displayObject.parent) {
      entity.displayObject.parent.removeChild(entity.displayObject);
    }
    entity.destroy();
  }

  onEntityRemoved(callback: (entity: Entity) => void): void {
    this.onEntityRemovedCallbacks.push(callback);
  }

  registerContainer(name: string, container: Container): void {
    this.containersMap.set(name, container);
  }

  getContainer(name: string): Container | undefined {
    return this.containersMap.get(name);
  }

  update(deltaTime: number, currentTime: number): void {
    const expiredEntities: Entity[] = [];

    for (const entity of this.entities) {
      entity.update(deltaTime, currentTime);

      if (entity.isExpired(currentTime)) {
        expiredEntities.push(entity);
      }
    }

    // Notify callbacks before removing entities
    for (const entity of expiredEntities) {
      for (const callback of this.onEntityRemovedCallbacks) {
        callback(entity);
      }
      this.removeEntity(entity);
    }
  }

  getEntitiesByType<T extends Entity>(entityType: string): T[] {
    return Array.from(this.entities).filter(
      (entity): entity is T => entity.entityType === entityType
    );
  }

  clear(): void {
    for (const entity of this.entities) {
      entity.destroy();
    }
    this.entities.clear();
  }
}
