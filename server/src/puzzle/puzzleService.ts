import { query } from '../db';
import { Puzzle, Group } from '../../../shared/Types';
import { v4 as uuidv4 } from 'uuid';

export class PuzzleService {
  /**
   * Retrieve a puzzle by its ID from database
   */
  async getPuzzleById(id: string): Promise<Puzzle | null> {
    const result = await query('SELECT * FROM puzzles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToPuzzle(result.rows[0]);
  }

  /**
   * Save puzzle to database
   * Admin-created puzzles are auto-verified
   * @param puzzle - Puzzle object to save
   * @param createdBy - 'ADMIN' or 'AI' (default: 'ADMIN')
   */
  async savePuzzle(puzzle: Puzzle, createdBy?: string): Promise<Puzzle> {
    const isAdminCreated = createdBy === 'ADMIN';
    
    const result = await query(
      `INSERT INTO puzzles (id, created_by, data, game_name, overall_difficulty, verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        puzzle.id,
        createdBy || 'ADMIN', // 'AI' for AI-generated, 'ADMIN' for admin uploads
        JSON.stringify(puzzle.groups),
        puzzle.gameName || 'Untitled Game',
        puzzle.overallDifficulty || 'medium',
        isAdminCreated // admin puzzles are auto-verified
      ]
    );

    return this.rowToPuzzle(result.rows[0]);
  }

  async deletePuzzle(id: string): Promise<boolean> {
    const result = await query('DELETE FROM puzzles WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getRandomPuzzle(): Promise<Puzzle | null> {
    const result = await query(
      'SELECT * FROM puzzles ORDER BY RANDOM() LIMIT 1'
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToPuzzle(result.rows[0]);
  }

  async getAllPuzzles(limit: number = 50): Promise<Puzzle[]> {
    const result = await query(
      'SELECT * FROM puzzles ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    return result.rows.map(row => this.rowToPuzzle(row));
  }

  checkGuess(puzzle: Puzzle, selectedWords: string[]): { success: boolean; group?: Group } {
    if (selectedWords.length !== 4) {
      return { success: false };
    }

    const normalizedGuess = selectedWords.map(w => w.toLowerCase().trim()).sort();

    for (const group of puzzle.groups) {
      const groupWords = group.words.map(w => w.text.toLowerCase().trim()).sort();
      
      if (JSON.stringify(normalizedGuess) === JSON.stringify(groupWords)) {
        return { success: true, group };
      }
    }

    return { success: false };
  }

  calculateScore(attempts: number, completionTime: number): number {
    // Base score: 1000 points
    // Deduct 200 for each attempt
    // Deduct 1 point per second
    const attemptPenalty = (attempts - 1) * 200;
    const timePenalty = Math.floor(completionTime / 1000);
    
    return Math.max(100, 1000 - attemptPenalty - timePenalty);
  }

  async ratePuzzle(puzzleId: string, ratingChange: number): Promise<void> {
    await query(
      'UPDATE puzzles SET rating = rating + $1 WHERE id = $2',
      [ratingChange, puzzleId]
    );
  }

  private rowToPuzzle(row: any): Puzzle {
    return {
      id: row.id,
      groups: row.data as Group[],
      createdAt: row.created_at,
      createdBy: row.created_by,
      gameName: row.game_name,
      overallDifficulty: row.overall_difficulty,
      verified: row.verified || false
    };
  }

  /**
   * Mark puzzle as verified by admin
   * Verified puzzles won't be auto-deleted after 24h
   */
  async verifyPuzzle(puzzleId: string): Promise<void> {
    await query('UPDATE puzzles SET verified = TRUE WHERE id = $1', [puzzleId]);
  }

  async cleanupUnverifiedPuzzles(): Promise<number> {
    const result = await query(
      `DELETE FROM puzzles 
       WHERE verified = FALSE 
       AND created_at < NOW() - INTERVAL '24 hours'
       RETURNING id`,
      []
    );
    return result.rowCount || 0;
  }
}

export const puzzleService = new PuzzleService();
