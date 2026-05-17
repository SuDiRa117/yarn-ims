const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// In production use DB_PATH env var (set to a Railway volume mount path to persist data)
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../../data/yarn_ims.db');

// Ensure directory exists before opening database
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
