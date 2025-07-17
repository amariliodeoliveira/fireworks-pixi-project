import { ColorSource } from "pixi.js";

// =============================================================================
// BASIC TYPES
// =============================================================================

/**
 * Represents a 2D coordinate or vector
 */
export interface Vector2D {
  x: number;
  y: number;
}

// =============================================================================
// FIREWORK CONFIGURATION TYPES
// =============================================================================

/**
 * Base configuration for all firework types
 */
export interface BaseFirework {
  /** When the firework should start (in milliseconds) */
  begin: number;
  /** Color of the firework */
  colour: ColorSource;
  /** How long the firework should last (in milliseconds) */
  duration: number;
  /** Starting position of the firework */
  position: Vector2D;
}

/**
 * Configuration for fountain-type fireworks that emit particles continuously
 */
export interface FountainFirework extends BaseFirework {
  readonly type: "Fountain";
}

/**
 * Configuration for rocket-type fireworks that move and explode
 */
export interface RocketFirework extends BaseFirework {
  readonly type: "Rocket";
  /** Initial velocity of the rocket */
  velocity: Vector2D;
}

// =============================================================================
// UNION TYPES
// =============================================================================

/**
 * Union type for all firework configurations
 */
export type Firework = FountainFirework | RocketFirework;

/**
 * String literal type for firework types
 */
export type FireworkType = Firework["type"];

// =============================================================================
// DISPLAY TYPES
// =============================================================================

/**
 * Container for multiple firework configurations
 */
export interface FireworkDisplay {
  fireworks: Firework[];
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if a firework is a fountain
 */
export function isFountainFirework(
  firework: Firework
): firework is FountainFirework {
  return firework.type === "Fountain";
}

/**
 * Type guard to check if a firework is a rocket
 */
export function isRocketFirework(
  firework: Firework
): firework is RocketFirework {
  return firework.type === "Rocket";
}
