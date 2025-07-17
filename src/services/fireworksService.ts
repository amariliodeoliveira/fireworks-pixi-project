import type { FireworkDisplay } from "../types/firework";
import { parseFireworksXML } from "../utils/fireworksParser";

export async function loadFireworks(): Promise<FireworkDisplay> {
  try {
    const response = await fetch("/fireworks.xml");

    if (!response.ok) {
      throw new Error(`Failed to load fireworks.xml: ${response.status}`);
    }

    const xmlText = await response.text();
    return parseFireworksXML(xmlText);
  } catch (error) {
    console.error("Error loading fireworks:", error);
    throw new Error(
      `Failed to load fireworks: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
