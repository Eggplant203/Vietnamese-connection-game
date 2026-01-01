import pool from './index';

const addMissingColumns = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Add game_name column if not exists
    await client.query(`
      ALTER TABLE puzzles 
      ADD COLUMN IF NOT EXISTS game_name VARCHAR(500)
    `);
    
    // Add overall_difficulty column if not exists
    await client.query(`
      ALTER TABLE puzzles 
      ADD COLUMN IF NOT EXISTS overall_difficulty VARCHAR(50)
    `);
    
    await client.query('COMMIT');
    console.log('✅ Missing columns added successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding columns:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

addMissingColumns()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
