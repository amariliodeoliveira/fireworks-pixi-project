export type TimeUnit = "ms" | "s" | "m" | "h";

export class Time {
  static convert(value: number, from: TimeUnit, to: TimeUnit): number {
    const conversions = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
    };

    return (value * conversions[from]) / conversions[to];
  }
}
