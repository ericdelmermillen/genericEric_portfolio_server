import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection when the pool is created
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database");
    connection.release(); 
  } catch (err) {
    console.error("Unable to connect to MySQL database:", err.message);
  }
})();

export default pool;