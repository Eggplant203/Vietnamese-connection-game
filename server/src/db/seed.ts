import pool from './index';
import { v4 as uuidv4 } from 'uuid';

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create sample users
    const users = [
      { id: uuidv4(), username: 'player1', email: 'player1@example.com' },
      { id: uuidv4(), username: 'player2', email: 'player2@example.com' },
      { id: uuidv4(), username: 'player3', email: 'player3@example.com' },
    ];

    for (const user of users) {
      await client.query(
        'INSERT INTO users (id, username, email) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
        [user.id, user.username, user.email]
      );
    }

    // NO DEFAULT PUZZLES - Database should be empty initially
    // Users must add puzzles via Admin panel
    console.log('✅ Database initialized (no default puzzles)');

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedData;
