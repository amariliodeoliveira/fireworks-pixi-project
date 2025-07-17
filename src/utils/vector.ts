export interface Vector2D {
  x: number;
  y: number;
}

export const Vector2D = {
  create: (x: number, y: number): Vector2D => ({ x, y }),
  fromAngle: (angle: number, magnitude: number): Vector2D => ({
    x: Math.cos(angle) * magnitude,
    y: Math.sin(angle) * magnitude,
  }),
  copy: (vector: Vector2D): Vector2D => ({ x: vector.x, y: vector.y }),
} as const;
