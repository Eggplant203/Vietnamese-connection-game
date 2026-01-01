import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Puzzle, Group, User, GameMode } from '@shared/Types';

interface GameState {
  // Puzzle state
  currentPuzzle: Puzzle | null;
  selectedWords: string[];
  foundGroups: Group[];
  attempts: number;
  maxAttempts: number;
  startTime: number | null;
  completionTime: number | null;
  isComplete: boolean;
  isFailed: boolean;
  
  // User state
  user: User | null;
  
  // UI state
  isLoading: boolean;
  showConfetti: boolean;
  gameMode: GameMode;
  
  // Actions
  setPuzzle: (puzzle: Puzzle) => void;
  toggleWord: (wordText: string) => void;
  clearSelection: () => void;
  addFoundGroup: (group: Group) => void;
  incrementAttempts: () => void;
  resetGame: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setShowConfetti: (show: boolean) => void;
  setGameMode: (mode: GameMode) => void;
  completeGame: () => void;
  failGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Initial state
      currentPuzzle: null,
      selectedWords: [],
      foundGroups: [],
      attempts: 0,
      maxAttempts: 4,
      startTime: null,
      completionTime: null,
      isComplete: false,
      isFailed: false,
      user: null,
      isLoading: false,
      showConfetti: false,
      gameMode: 'archive',

      // Actions
      setPuzzle: (puzzle) =>
        set({
          currentPuzzle: puzzle,
          selectedWords: [],
          foundGroups: [],
          attempts: 0,
          startTime: Date.now(),
          completionTime: null,
          isComplete: false,
          isFailed: false,
          showConfetti: false,
        }),

      toggleWord: (wordText) =>
        set((state) => {
          const isSelected = state.selectedWords.includes(wordText);
          const newSelection = isSelected
            ? state.selectedWords.filter((w) => w !== wordText)
            : state.selectedWords.length < 4
            ? [...state.selectedWords, wordText]
            : state.selectedWords;

          return { selectedWords: newSelection };
        }),

      clearSelection: () => set({ selectedWords: [] }),

      addFoundGroup: (group) =>
        set((state) => {
          const newFoundGroups = [...state.foundGroups, group];
          const isComplete = newFoundGroups.length === 4;
          const completionTime = isComplete && state.startTime
            ? Math.floor((Date.now() - state.startTime) / 1000)
            : state.completionTime;
          
          return {
            foundGroups: newFoundGroups,
            selectedWords: [],
            isComplete,
            completionTime,
            showConfetti: isComplete,
          };
        }),

      incrementAttempts: () =>
        set((state) => {
          const newAttempts = state.attempts + 1;
          const isFailed = newAttempts >= state.maxAttempts;
          const completionTime = isFailed && state.startTime
            ? Math.floor((Date.now() - state.startTime) / 1000)
            : state.completionTime;
          
          return {
            attempts: newAttempts,
            isFailed,
            completionTime,
            selectedWords: [],
          };
        }),

      resetGame: () =>
        set({
          currentPuzzle: null,
          selectedWords: [],
          foundGroups: [],
          attempts: 0,
          startTime: null,
          completionTime: null,
          isComplete: false,
          isFailed: false,
          showConfetti: false,
        }),

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      setShowConfetti: (show) => set({ showConfetti: show }),

      setGameMode: (mode) => set({ gameMode: mode }),

      completeGame: () => set({ isComplete: true, showConfetti: true }),

      failGame: () => set({ isFailed: true }),
    }),
    {
      name: 'vn-connections-storage',
      partialize: (state) => ({
        user: state.user,
        gameMode: state.gameMode,
      }),
    }
  )
);
