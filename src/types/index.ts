export interface Theme {
  id: string;
  label: string;
  club: string;
  primary: string;
  bright: string;
  dim: string;
  heroFrom: string;
}

export interface Player {
  position: string;
  foot: string;
  height: string;
  club: string;
  jersey: string;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  homeTeam: string;
  homeScore: number;
  awayScore: number;
  goals: number;
  assists: number;
  cleanSheet: boolean;
  motm: boolean;
  rating: number;
  position: string;
  minutes: number;
  feeling: string;
  notes: string;
}

export interface NextMatch {
  opponent: string;
  kickoff: string; // ISO datetime
}

export interface Account {
  id: string;
  name: string;
  email: string;
  theme: Theme;
  player: Player;
  matches: Match[];
  nextMatch: NextMatch | null;
}

export type MatchFormInput = {
  opponent: string;
  date: string;
  homeScore: number;
  awayScore: number;
  goals: number;
  assists: number;
  yellow: number;
  red: number;
  minutes: number;
  position: string;
  rating: number;
  feeling: string;
  notes: string;
};
