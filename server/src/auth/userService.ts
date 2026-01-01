import { query } from '../db';
import { User } from '../shared/Types';

export class UserService {
  async createUser(username: string, email?: string): Promise<User> {
    const result = await query(
      `INSERT INTO users (username, email)
       VALUES ($1, $2)
       RETURNING *`,
      [username, email]
    );

    return this.rowToUser(result.rows[0]);
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToUser(result.rows[0]);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToUser(result.rows[0]);
  }

  private rowToUser(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      createdAt: row.created_at
    };
  }
}

export const userService = new UserService();
