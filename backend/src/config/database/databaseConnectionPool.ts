import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'project';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const getDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error("데이터베이스 연결 실패:", err);
    throw new Error("데이터베이스 연결이 실패했습니다.");
  }
};