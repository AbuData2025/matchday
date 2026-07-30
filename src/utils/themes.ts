import type { Theme } from "../types";

export const CLUB_PRESETS: Theme[] = [
  {
    id: "mutd",
    label: "Devil Red",
    club: "Manchester United",
    primary: "#DA020E",
    bright: "#FF4433",
    dim: "#4A0808",
    heroFrom: "#2E0A0A",
  },
  {
    id: "liverpool",
    label: "Anfield Red",
    club: "Liverpool",
    primary: "#C8102E",
    bright: "#E63950",
    dim: "#3D0812",
    heroFrom: "#26060F",
  },
  {
    id: "city",
    label: "Sky Blue",
    club: "Man City",
    primary: "#6CABDD",
    bright: "#8FC4EE",
    dim: "#0E2635",
    heroFrom: "#0A1E2B",
  },
  {
    id: "custom",
    label: "Custom",
    club: "Your Club",
    primary: "#3FA34D",
    bright: "#57C968",
    dim: "#173321",
    heroFrom: "#0F241A",
  },
];

export function buildCustomTheme(hex: string, club: string): Theme {
  return {
    id: "custom",
    label: "Custom",
    club: club || "Your Club",
    primary: hex,
    bright: hex,
    dim: `color-mix(in srgb, ${hex} 20%, #0b0b0b)`,
    heroFrom: `color-mix(in srgb, ${hex} 32%, #0b0b0b)`,
  };
}
