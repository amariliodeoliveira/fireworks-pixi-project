import { Sprite, ColorSource } from "pixi.js";
import { Vector2D } from "../types/firework";

export abstract class Entity {
  protected sprite: Sprite;
  protected _startTime: number;
  protected _duration: number;
  protected _colour: ColorSource;
  public readonly entityType: string;

  constructor(
    sprite: Sprite,
    duration: number,
    colour: ColorSource,
    entityType: string,
    startTime: number = performance.now()
  ) {
    this.sprite = sprite;
    this._duration = duration;
    this._colour = colour;
    this.entityType = entityType;
    this._startTime = startTime;

    this.setupSprite();
  }

  protected setupSprite(): void {
    this.sprite.anchor.set(0.5);
    this.sprite.blendMode = "add";
    this.sprite.tint = this._colour;
  }

  get x(): number {
    return this.sprite.x;
  }

  set x(value: number) {
    this.sprite.x = value;
  }

  get y(): number {
    return this.sprite.y;
  }

  set y(value: number) {
    this.sprite.y = value;
  }

  get position(): Vector2D {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  set position(pos: Vector2D) {
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
  }

  get colour(): ColorSource {
    return this._colour;
  }

  get startTime(): number {
    return this._startTime;
  }

  get duration(): number {
    return this._duration;
  }

  get displayObject(): Sprite {
    return this.sprite;
  }

  isExpired(currentTime: number): boolean {
    return currentTime - this._startTime >= this._duration;
  }

  abstract update(deltaTime: number, currentTime: number): void;

  destroy(): void {
    this.sprite.destroy();
  }
}
