import type {
  FireworkDisplay,
  FireworkType,
  Firework,
} from "../types/firework";

export function parseFireworksXML(xmlText: string): FireworkDisplay {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid XML format");
  }

  return parseFireworkDisplay(xmlDoc);
}

function parseFireworkDisplay(xmlDoc: Document): FireworkDisplay {
  const fireworks: Firework[] = [];
  const fireworkNodes = xmlDoc.getElementsByTagName("Firework");

  for (let i = 0; i < fireworkNodes.length; i++) {
    const fwNode = fireworkNodes[i];

    const begin = Number(fwNode.getAttribute("begin"));
    const type = fwNode.getAttribute("type") as FireworkType;
    const colour = Number(fwNode.getAttribute("colour"));
    const duration = Number(fwNode.getAttribute("duration"));

    const posNode = fwNode.getElementsByTagName("Position")[0];
    const position = {
      x: Number(posNode.getAttribute("x")),
      y: Number(posNode.getAttribute("y")),
    };

    if (type === "Fountain") {
      fireworks.push({ begin, type, colour, duration, position });
    } else if (type === "Rocket") {
      const velNode = fwNode.getElementsByTagName("Velocity")[0];
      if (!velNode) {
        throw new Error("Rocket firework missing Velocity element");
      }
      const velocity = {
        x: Number(velNode.getAttribute("x")),
        y: Number(velNode.getAttribute("y")),
      };
      fireworks.push({ begin, type, colour, duration, position, velocity });
    }
  }

  return { fireworks };
}
