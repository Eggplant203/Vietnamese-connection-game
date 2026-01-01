import { query } from '../db';

export class CleanupService {
  /**
   * Auto-delete puzzles with rating below -10
   * Runs every 6 hours via cron job
   * @returns Number of puzzles deleted
   */
  async deleteUnpopularPuzzles(): Promise<number> {
    const result = await query(
      'DELETE FROM puzzles WHERE rating < -10 RETURNING id'
    );
    const deletedCount = result.rowCount || 0;
    
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} unpopular puzzle(s) with rating < -10`);
    }
    
    return deletedCount;
  }

  /**
   * Auto-delete AI-generated puzzles not verified within 24 hours
   * Prevents database clutter from unused AI puzzles
   * @returns Number of puzzles deleted
   */
  async deleteUnverifiedPuzzles(): Promise<number> {
    const result = await query(
      `DELETE FROM puzzles 
       WHERE verified = FALSE 
       AND created_at < NOW() - INTERVAL '24 hours'
       RETURNING id`
    );
    const deletedCount = result.rowCount || 0;
    
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} unverified puzzle(s) older than 24h`);
    }
    
    return deletedCount;
  }

  // Get weighted random puzzle (lower rating = lower chance)
  async getWeightedRandomPuzzle(): Promise<any | null> {
    // Rating >= 0: normal chance
    // -5 <= rating < 0: 50% chance
    // -10 <= rating < -5: 10% chance
    const result = await query(`
      SELECT * FROM puzzles
      WHERE 
        CASE 
          WHEN rating >= 0 THEN true
          WHEN rating >= -5 THEN random() > 0.5
          WHEN rating >= -10 THEN random() > 0.9
          ELSE false
        END
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
}

export const cleanupService = new CleanupService();
