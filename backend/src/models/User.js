const db = require('../config/database');

class User {
  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }

  static create({ username, password, email, department, role }) {
    const result = db.prepare(
      'INSERT INTO users (username, password, email, department, role) VALUES (?, ?, ?, ?, ?)'
    ).run(username, password, email, department, role);
    return result.lastInsertRowid;
  }

  static getAll() {
    return db.prepare(
      'SELECT id, username, email, department, role, created_at FROM users ORDER BY created_at DESC'
    ).all();
  }
}

module.exports = User;
