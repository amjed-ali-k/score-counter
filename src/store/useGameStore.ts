import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GameSettings, GameState, Player } from '../types/player';

interface StoreState {
  currentGame: GameState;
  gameHistory: GameState[];
  undoStack: GameState[];
  redoStack: GameState[];
  settings: GameSettings;
  
  // Game actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updateScore: (id: string, score: number) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  startNewGame: () => void;
  resumeGame: (gameId: string) => void;
  undo: () => void;
  redo: () => void;
  
  // Import/Export
  exportHistory: () => string;
  importHistory: (jsonData: string) => void;
}

const colors = [
  'bg-blue-500',
  'bg-red-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
];

const createNewGame = (): GameState => ({
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  players: [],
  settings: {
    incrementValue: 1,
    maxScore: null,
    isReversed: false,
  },
  winner: null,
});

const checkWinner = (players: Player[], settings: GameSettings): Player | null => {
  if (!settings.maxScore || players.length === 0) return null;
  
  const compareScore = (a: number, b: number) => 
    settings.isReversed ? a <= b : a >= b;
  
  const potentialWinner = settings.isReversed
    ? players.reduce((min, p) => (p.score < min.score ? p : min))
    : players.reduce((max, p) => (p.score > max.score ? p : max));

  return compareScore(potentialWinner.score, settings.maxScore) ? potentialWinner : null;
};

export const useGameStore = create(
  persist<StoreState>(
    (set, get) => ({
      currentGame: createNewGame(),
      gameHistory: [],
      undoStack: [],
      redoStack: [],
      settings: {
        incrementValue: 1,
        maxScore: null,
        isReversed: false,
      },

      addPlayer: (name) =>
        set((state) => {
          const newPlayer = {
            id: crypto.randomUUID(),
            name,
            score: 0,
            color: colors[state.currentGame.players.length % colors.length],
            history: [],
          };
          
          const newGame = {
            ...state.currentGame,
            players: [...state.currentGame.players, newPlayer],
          };

          return {
            currentGame: newGame,
            undoStack: [...state.undoStack, state.currentGame],
            redoStack: [],
          };
        }),

      removePlayer: (id) =>
        set((state) => {
          const newGame = {
            ...state.currentGame,
            players: state.currentGame.players.filter((p) => p.id !== id),
          };

          return {
            currentGame: newGame,
            undoStack: [...state.undoStack, state.currentGame],
            redoStack: [],
          };
        }),

      updateScore: (id, score) =>
        set((state) => {
          const newPlayers = state.currentGame.players.map((player) =>
            player.id === id
              ? {
                  ...player,
                  score: player.score + score,
                  history: [...player.history, player.score + score],
                }
              : player
          );

          const newGame = {
            ...state.currentGame,
            players: newPlayers,
            winner: checkWinner(newPlayers, state.currentGame.settings),
          };

          return {
            currentGame: newGame,
            undoStack: [...state.undoStack, state.currentGame],
            redoStack: [],
          };
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          currentGame: {
            ...state.currentGame,
            settings: { ...state.currentGame.settings, ...newSettings },
          },
        })),

      startNewGame: () =>
        set((state) => ({
          currentGame: createNewGame(),
          gameHistory: [state.currentGame, ...state.gameHistory],
          undoStack: [],
          redoStack: [],
        })),

      resumeGame: (gameId) =>
        set((state) => {
          const game = state.gameHistory.find((g) => g.id === gameId);
          if (!game) return state;

          return {
            currentGame: game,
            gameHistory: state.gameHistory.filter((g) => g.id !== gameId),
            undoStack: [],
            redoStack: [],
          };
        }),

      undo: () =>
        set((state) => {
          const [lastState, ...remainingUndo] = state.undoStack;
          if (!lastState) return state;

          return {
            currentGame: lastState,
            undoStack: remainingUndo,
            redoStack: [state.currentGame, ...state.redoStack],
          };
        }),

      redo: () =>
        set((state) => {
          const [nextState, ...remainingRedo] = state.redoStack;
          if (!nextState) return state;

          return {
            currentGame: nextState,
            undoStack: [state.currentGame, ...state.undoStack],
            redoStack: remainingRedo,
          };
        }),

      exportHistory: () => {
        const state = get();
        return JSON.stringify({
          currentGame: state.currentGame,
          gameHistory: state.gameHistory,
        });
      },

      importHistory: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            currentGame: data.currentGame,
            gameHistory: data.gameHistory,
            undoStack: [],
            redoStack: [],
          });
        } catch (error) {
          console.error('Failed to import game history:', error);
        }
      },
    }),
    {
      name: 'dominos-score-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);