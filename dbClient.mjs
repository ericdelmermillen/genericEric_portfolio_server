import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;
const DB_CONNECTION_LIMIT = parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10;
const DB_QUEUE_LIMIT = parseInt(process.env.DB_QUEUE_LIMIT, 10) || 0;

if(!HOST || !USER || !PASSWORD || !DATABASE) {
  throw new Error("Missing required database environment variables.");
};

// Create MySQL connection pool
const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
  connectionLimit: DB_CONNECTION_LIMIT,
  queueLimit: DB_QUEUE_LIMIT
});

// Test connection when the pool is created
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database");
    connection.release(); 
  } catch (error) {
    console.error(`Unable to connect to MySQL database: ${error.message}`);
    throw error;
  };
})();

export default pool;