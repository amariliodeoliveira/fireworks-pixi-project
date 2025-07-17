import { Fountain } from "../entities/Fountain";
import { Rocket } from "../entities/Rocket";
import { FountainFirework, RocketFirework } from "../types/firework";

export class FireworkFactory {
  static createFountain(config: FountainFirework): Fountain {
    return new Fountain(config.position, config.colour, config.duration);
  }

  static createRocket(config: RocketFirework): Rocket {
    return new Rocket(
      config.position,
      config.velocity,
      config.colour,
      config.duration
    );
  }
}
