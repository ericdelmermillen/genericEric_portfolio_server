import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("running seeds")

const DB_DATABASE = process.env.DB_DATABASE;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const config = {
  host: DB_HOST || 'localhost',
  user: DB_USER || 'root',
  password: DB_PASSWORD || '',
  database: DB_DATABASE,
  multipleStatements: true
};

const runSeeds = async () => {
  const command = process.argv[2] || 'up';
  let connection;

  try {
    connection = await mysql.createConnection(config);
    
    // Seed tracking table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seeded (
        seed_id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [ executed ] = await connection.query(`SELECT seed_id FROM seeded`);
    const executedIds = executed.map(row => row.seed_id);

    const seedFiles = fs.readdirSync(path.join(__dirname, 'scripts'))
      .sort()
      .filter(file => file.endsWith('.sql'));

    if(command === 'up') {
      for(const file of seedFiles) {
        if(!executedIds.includes(file)) {
          console.log(`Seeding: ${file}`);
          const sql = fs.readFileSync(path.join(__dirname, 'scripts', file), 'utf8');
          
          const statements = sql.split(';').filter(s => s.trim());
          for(const statement of statements) {
            if(statement) await connection.query(statement);
          };

          await connection.query(
            `INSERT INTO seeded (seed_id) VALUES (?)`,
            [file]
          );
        };
      };

      console.log('Seeding complete!');
    } else if(command === 'down') {
      const lastSeed = executedIds.pop();

      if(!lastSeed) {
        console.log('No seeds to rollback');
        return;
      };

      console.log(`Rolling back seed: ${lastSeed}`);

      await connection.query(`DELETE FROM seeded WHERE seed_id = ?`, [lastSeed]);

      console.log(`Seed record removed: ${lastSeed}`);
    }

  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if(connection) await connection.end();
  };
};

runSeeds();