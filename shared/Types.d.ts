export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type OverallDifficulty = 'easy' | 'medium' | 'hard' | 'brain-teaser';
export type GroupColor = 'green' | 'yellow' | 'purple' | 'red';
export type GameMode = 'archive' | 'random';
export interface Word {
    id: string;
    text: string;
}
export interface Group {
    id: string;
    theme: string;
    words: Word[];
    color: GroupColor;
    difficulty: DifficultyLevel;
}
export interface Puzzle {
    id: string;
    gameName?: string;
    overallDifficulty: OverallDifficulty;
    groups: Group[];
    createdAt: Date;
    createdBy?: string;
    verified?: boolean;
}
export interface PuzzleState {
    puzzleId: string;
    selectedWords: string[];
    foundGroups: Group[];
    attempts: number;
    maxAttempts: number;
    isComplete: boolean;
    isFailed: boolean;
    startTime: Date;
    endTime?: Date;
}
export interface AttemptResult {
    success: boolean;
    group?: Group;
    message: string;
    remainingAttempts: number;
}
export interface LeaderboardEntry {
    id: string;
    userId: string;
    username: string;
    puzzleId: string;
    completionTime: number;
    attempts: number;
    score: number;
    createdAt: Date;
}
export interface User {
    id: string;
    username: string;
    email?: string;
    createdAt: Date;
}
export interface UserStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    bestTime: number;
    bestScore: number;
    lastPlayed?: Date;
}
export interface AIGenerateRequest {
    theme?: string;
}
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface AdminPuzzleUpload {
    gameName: string;
    overallDifficulty: OverallDifficulty;
    groups: {
        theme: string;
        words: string;
        difficulty: DifficultyLevel;
    }[];
}
//# sourceMappingURL=Types.d.ts.map