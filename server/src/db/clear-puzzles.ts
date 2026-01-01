import pool from './index';

const clearPuzzles = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Delete all puzzles
    await client.query('DELETE FROM puzzles');
    
    await client.query('COMMIT');
    console.log('✅ All puzzles deleted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing puzzles:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

clearPuzzles()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
