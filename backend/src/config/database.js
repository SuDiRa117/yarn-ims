const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// In production use DB_PATH env var (set to a Railway volume mount path to persist data)
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../../data/yarn_ims.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
