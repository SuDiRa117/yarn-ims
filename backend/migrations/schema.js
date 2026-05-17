const bcrypt = require('bcryptjs');

const createSchema = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      department TEXT,
      role TEXT DEFAULT 'operator' CHECK(role IN ('admin', 'operator', 'viewer')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS received_yarn (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_number TEXT UNIQUE NOT NULL,
      style TEXT NOT NULL CHECK(style IN ('Cobalt', 'Decand', 'OCL Collar', 'Custom')),
      yarn_name TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      number_of_cones INTEGER NOT NULL,
      colour TEXT NOT NULL,
      date_received TEXT DEFAULT (datetime('now')),
      notes TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS issued_yarn (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      received_yarn_id INTEGER NOT NULL REFERENCES received_yarn(id),
      lot_number TEXT NOT NULL,
      issued_to TEXT NOT NULL,
      quantity_issued INTEGER NOT NULL,
      purpose TEXT,
      issue_date TEXT DEFAULT (datetime('now')),
      expected_return_date TEXT,
      actual_return_date TEXT,
      issued_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rejected_yarn (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      received_yarn_id INTEGER NOT NULL REFERENCES received_yarn(id),
      lot_number TEXT NOT NULL,
      rejection_reason TEXT NOT NULL,
      rejection_details TEXT,
      severity_level TEXT NOT NULL CHECK(severity_level IN ('Minor', 'Major', 'Critical')),
      can_be_reused INTEGER DEFAULT 0,
      rejection_date TEXT DEFAULT (datetime('now')),
      rejected_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS qc_yarn (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      received_yarn_id INTEGER NOT NULL REFERENCES received_yarn(id),
      lot_number TEXT NOT NULL,
      test_type TEXT NOT NULL,
      test_status TEXT DEFAULT 'Pending' CHECK(test_status IN ('Pending', 'In Progress', 'Completed', 'Failed')),
      expected_completion_date TEXT,
      test_result TEXT,
      tested_by INTEGER REFERENCES users(id),
      test_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      record_id INTEGER,
      user_id INTEGER REFERENCES users(id),
      old_value TEXT,
      new_value TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
  `);

  // Seed default admin user
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existing) {
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)'
    ).run('admin', hashed, 'admin@yarnims.local', 'admin');
    console.log('Default admin user created (username: admin, password: admin123)');
  }

  console.log('Database schema created successfully');
};

module.exports = { createSchema };
