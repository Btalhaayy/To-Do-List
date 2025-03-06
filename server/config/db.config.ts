import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'todos'
};

console.log('Database Config:', {
  ...dbConfig,
  password: '[HIDDEN]'
});

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');

    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Available tables:', tables);

    const [structure] = await connection.execute('DESCRIBE todos');
    console.log('Todos table structure:', structure);

    connection.release();
  } catch (error) {
    console.error('Database Connection Error:', error);
    process.exit(1);
  }
};

testConnection();

export default pool;