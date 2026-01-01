import { UserStats } from '../../../shared/Types';

const STATS_KEY = 'vn-connections-stats';

const defaultStats: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  bestTime: 0,
  bestScore: 0,
  lastPlayed: undefined
};

export const getStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultStats;
    
    const parsed = JSON.parse(stored);
    return {
      ...defaultStats,
      ...parsed,
      lastPlayed: parsed.lastPlayed ? new Date(parsed.lastPlayed) : undefined
    };
  } catch {
    return defaultStats;
  }
};

export const saveStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    // console.error('Failed to save stats:', error);
  }
};

export const updateStats = (won: boolean, time: number, score?: number): UserStats => {
  const current = getStats();
  
  const newStats: UserStats = {
    gamesPlayed: current.gamesPlayed + 1,
    gamesWon: current.gamesWon + (won ? 1 : 0),
    currentStreak: won ? current.currentStreak + 1 : 0,
    maxStreak: won ? Math.max(current.maxStreak, current.currentStreak + 1) : current.maxStreak,
    bestTime: won ? (current.bestTime === 0 ? time : Math.min(current.bestTime, time)) : current.bestTime,
    bestScore: won && score ? Math.max(current.bestScore, score) : current.bestScore,
    lastPlayed: new Date()
  };
  
  saveStats(newStats);
  return newStats;
};

export const resetStats = (): void => {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    // console.error('Failed to reset stats:', error);
  }
};
