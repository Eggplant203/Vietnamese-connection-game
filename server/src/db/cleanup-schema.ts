import pool from './index';

const cleanupSchema = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🧹 Cleaning up database schema...');
    
    // 1. Drop unused tables
    console.log('  - Dropping unused tables (attempts, leaderboard)...');
    await client.query('DROP TABLE IF EXISTS leaderboard CASCADE');
    await client.query('DROP TABLE IF EXISTS attempts CASCADE');
    
    // 2. Remove unused columns from puzzles table
    console.log('  - Removing unused columns from puzzles table...');
    await client.query('ALTER TABLE puzzles DROP COLUMN IF EXISTS date');
    await client.query('ALTER TABLE puzzles DROP COLUMN IF EXISTS is_daily');
    
    // 3. Remove stats columns from users table (stats now in localStorage)
    console.log('  - Removing stats columns from users table...');
    await client.query('ALTER TABLE users DROP COLUMN IF EXISTS games_played');
    await client.query('ALTER TABLE users DROP COLUMN IF EXISTS games_won');
    await client.query('ALTER TABLE users DROP COLUMN IF EXISTS current_streak');
    await client.query('ALTER TABLE users DROP COLUMN IF EXISTS max_streak');
    await client.query('ALTER TABLE users DROP COLUMN IF EXISTS total_time');
    
    // 4. Drop unused indexes
    console.log('  - Dropping unused indexes...');
    await client.query('DROP INDEX IF EXISTS idx_puzzles_date');
    await client.query('DROP INDEX IF EXISTS idx_puzzles_is_daily');
    await client.query('DROP INDEX IF EXISTS idx_attempts_user');
    await client.query('DROP INDEX IF EXISTS idx_attempts_puzzle');
    await client.query('DROP INDEX IF EXISTS idx_leaderboard_puzzle');
    await client.query('DROP INDEX IF EXISTS idx_leaderboard_score');
    
    await client.query('COMMIT');
    console.log('✅ Database schema cleaned up successfully');
    console.log('\nRemaining tables:');
    console.log('  - users: id, username, email, password_hash, created_at');
    console.log('  - puzzles: id, game_name, overall_difficulty, created_by, created_at, data');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error cleaning up schema:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

cleanupSchema()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
