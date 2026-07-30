import type { Match } from "../types";

export interface Badge {
  id: string;
  label: string;
  earned: boolean;
}

export function computeBadges(matches: Match[]): Badge[] {
  const cleanSheets = matches.filter((m) => m.cleanSheet).length;

  return [
    { id: "first-goal", label: "First Goal", earned: matches.some((m) => m.goals > 0) },
    { id: "first-assist", label: "First Assist", earned: matches.some((m) => m.assists > 0) },
    { id: "clean-sheet-5", label: "Clean Sheet x5", earned: cleanSheets >= 5 },
    { id: "hat-trick", label: "Hat Trick Hero", earned: matches.some((m) => m.goals >= 3) },
    { id: "captain-fantastic", label: "Captain Fantastic", earned: matches.some((m) => m.rating >= 9) },
    { id: "iron-man", label: "Iron Man", earned: matches.length >= 10 },
  ];
}
