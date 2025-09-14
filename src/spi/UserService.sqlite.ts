import { UserDto } from "../domain/services/UserService";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export class UserServiceSqlite {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  async init(): Promise<void> {
    this.db = await open({
      filename: "users.db",
      driver: sqlite3.Database,
    });
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);
  }

  async saveUser(user: UserDto): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    const { id, name, email } = user;
    const query = `INSERT INTO users (id, name, email) VALUES (?, ?, ?) 
      ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email
      ON CONFLICT(email) DO UPDATE SET name = excluded.name
    `;
    await this.db.run(query, [id, name, email]);
  }

  async getUserById(id: string): Promise<UserDto | null> {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await this.db.get(query, [id]);
    if (result.length > 0) {
      const { id, name, email } = result[0];
      return { id, name, email };
    }
    return null;
  }

  async getAllUsers(): Promise<UserDto[]> {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    const query = `SELECT * FROM users`;
    const results = await this.db.all(query);
    return results.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
    }));
  }
}
