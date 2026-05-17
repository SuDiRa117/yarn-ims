const mysql = require('mysql2/promise');
const { initializeDatabase, createSchema } = require('./schema');
require('dotenv').config();

const runMigrations = async () => {
  try {
    console.log('Starting database migrations...');
    
    // Create database if not exists
    await initializeDatabase();
    
    // Create connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create tables
    await createSchema(pool);
    
    // Create default admin user
    const connection = await pool.getConnection();
    try {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(
        'INSERT IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin@yarnims.local', 'admin']
      );
      
      console.log('Default admin user created (if not already exists)');
    } finally {
      connection.release();
    }

    await pool.end();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
