import pool from './index';

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Users table (for admin authentication only - stats moved to localStorage)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Puzzles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS puzzles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        game_name VARCHAR(500),
        overall_difficulty VARCHAR(50),
        created_by VARCHAR(50) DEFAULT 'ADMIN',
        rating INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data JSONB NOT NULL
      )
    `);

    // Indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_puzzles_created_at ON puzzles(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON puzzles(overall_difficulty);
      CREATE INDEX IF NOT EXISTS idx_puzzles_rating ON puzzles(rating);
    `);

    await client.query('COMMIT');
    console.log('✅ Database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  createTables()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default createTables;
