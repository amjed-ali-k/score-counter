export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
  history: number[];
}

export interface GameSettings {
  incrementValue: number;
  maxScore: number | null;
  isReversed: boolean;
}

export interface GameState {
  id: string;
  timestamp: number;
  players: Player[];
  settings: GameSettings;
  winner: Player | null;
}