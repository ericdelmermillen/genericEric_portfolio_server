import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DATABASE = process.env.DB_DATABASE || 'generic_db';
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const config = {
  host: DB_HOST || 'localhost',
  user: DB_USER || 'root',
  password: DB_PASSWORD || '',
  database: 'mysql',
  multipleStatements: true
};

async function runMigrations() {
  const command = process.argv[2] || 'up';
  let connection;

  try {
    connection = await mysql.createConnection(config);
    
    // Database setup
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_DATABASE}`);
    await connection.query(`USE ${DB_DATABASE}`);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        migration_id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [executed] = await connection.query(`SELECT migration_id FROM migrations`);
    const executedIds = executed.map(row => row.migration_id);

    const migrationFiles = fs.readdirSync(path.join(__dirname, 'scripts'))
      .sort()
      .filter(file => file.endsWith('.sql'));

    if (command === 'up') {
      for (const file of migrationFiles) {
        if (!executedIds.includes(file)) {
          console.log(`Migrating up: ${file}`);
          const sql = fs.readFileSync(path.join(__dirname, 'scripts', file), 'utf8');
          const [up] = sql.split(/--\s*Down/i);
          
          const statements = up.replace(/--\s*Up/i, '')
            .split(';')
            .filter(s => s.trim());

          for (const statement of statements) {
            if (statement) await connection.query(statement);
          }

          await connection.query(
            `INSERT INTO migrations (migration_id) VALUES (?)`,
            [file]
          );
        }
      }
      console.log('All up migrations complete!');
    } else if (command === 'down') {
      const lastMigration = executedIds.pop();
      if (!lastMigration) {
        console.log('No migrations to rollback');
        return;
      }

      // Check if migration file exists
      const migrationPath = path.join(__dirname, 'scripts', lastMigration);
      if (!fs.existsSync(migrationPath)) {
        console.warn(`Skipping missing migration file: ${lastMigration}`);
        await connection.query(
          `DELETE FROM migrations WHERE migration_id = ?`,
          [lastMigration]
        );
        console.log(`Removed database record for missing migration: ${lastMigration}`);
        return;
      }

      console.log(`Migrating down: ${lastMigration}`);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const [, down] = sql.split(/--\s*Down/i);
      
      try {
        // Delete migration record first
        await connection.query(`USE ${DB_DATABASE}`);
        await connection.query(
          `DELETE FROM migrations WHERE migration_id = ?`,
          [lastMigration]
        );
        
        // Execute down migration
        const statements = down.split(';').filter(s => s.trim());
        for (const statement of statements) {
          if (statement) await connection.query(statement);
        }
        
        console.log(`Rollback complete for: ${lastMigration}`);
      } catch (error) {
        // Handle database deletion case
        if (error.code === 'ER_BAD_DB_ERROR') {
          console.log('Database already removed, cleaning migration history');
          await connection.query(
            `DELETE FROM mysql.${DB_DATABASE}.migrations WHERE migration_id = ?`,
            [lastMigration]
          );
        } else {
          throw error;
        }
      }
    }

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();