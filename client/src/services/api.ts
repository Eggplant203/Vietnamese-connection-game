import axios from 'axios';
import type { Puzzle, AttemptResult, LeaderboardEntry, User, APIResponse } from '@shared/Types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const puzzleAPI = {
  getArchivePuzzle: async (): Promise<Puzzle> => {
    const response = await api.get<APIResponse<Puzzle>>('/archive');
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  getRandomPuzzle: async (): Promise<Puzzle> => {
    const response = await api.get<APIResponse<Puzzle>>('/random');
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  submitGuess: async (puzzleId: string, selectedWords: string[], userId?: string): Promise<AttemptResult> => {
    const response = await api.post<APIResponse<AttemptResult>>('/submit', {
      puzzleId,
      selectedWords,
      userId,
    });
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  generatePuzzle: async (theme?: string): Promise<Puzzle> => {
    const response = await api.post<APIResponse<Puzzle>>('/ai/generate', { theme });
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  ratePuzzle: async (puzzleId: string, rating: number): Promise<void> => {
    const response = await api.post<APIResponse<void>>('/rate', {
      puzzleId,
      rating,
    });
    if (!response.data.success) throw new Error(response.data.error);
  },
};

export const leaderboardAPI = {
  getLeaderboard: async (puzzleId: string, limit?: number): Promise<LeaderboardEntry[]> => {
    const response = await api.get<APIResponse<LeaderboardEntry[]>>(`/leaderboard/${puzzleId}`, {
      params: { limit },
    });
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  getGlobalLeaderboard: async (limit?: number): Promise<any[]> => {
    const response = await api.get<APIResponse<any[]>>('/leaderboard', {
      params: { limit },
    });
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  submitScore: async (
    userId: string,
    username: string,
    puzzleId: string,
    completionTime: number,
    attempts: number
  ): Promise<any> => {
    const response = await api.post<APIResponse<any>>('/leaderboard', {
      userId,
      username,
      puzzleId,
      completionTime,
      attempts,
    });
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },
};

export const adminAPI = {
  login: async (password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    const response = await api.post('/admin/login', { password });
    return response.data;
  },

  uploadPuzzle: async (puzzle: any, token: string): Promise<any> => {
    const response = await api.post('/admin/upload', puzzle, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  verifyPuzzle: async (puzzleId: string, token: string): Promise<any> => {
    const response = await api.post(`/admin/verify/${puzzleId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deletePuzzle: async (puzzleId: string, token: string): Promise<any> => {
    const response = await api.delete(`/admin/puzzle/${puzzleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export const userAPI = {
  createOrGetUser: async (username: string, email?: string): Promise<User> => {
    const response = await api.post<APIResponse<User>>('/users', { username, email });
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },

  getUserStats: async (userId: string): Promise<any> => {
    const response = await api.get<APIResponse<any>>(`/users/${userId}/stats`);
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data!;
  },
};
