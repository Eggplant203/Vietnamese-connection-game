import pool from './index';

const addRatingColumn = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Drop foreign key constraint first
    await client.query(`
      ALTER TABLE puzzles 
      DROP CONSTRAINT IF EXISTS puzzles_created_by_fkey
    `);

    // Update created_by to VARCHAR
    await client.query(`
      ALTER TABLE puzzles 
      ALTER COLUMN created_by TYPE VARCHAR(50) USING created_by::VARCHAR
    `);

    // Add rating column if not exists
    await client.query(`
      ALTER TABLE puzzles 
      ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 0
    `);

    // Add rating index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_puzzles_rating ON puzzles(rating)
    `);

    await client.query('COMMIT');
    console.log('✅ Rating column added successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding rating column:', error);
    throw error;
  } finally {
    client.release();
  }
};

addRatingColumn()
  .then(() => {
    console.log('Migration complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
