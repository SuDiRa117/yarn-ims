const db = require('../config/database');

class AuditLog {
  static log(action, module, record_id, user_id, oldValue = null, newValue = null) {
    try {
      db.prepare(
        'INSERT INTO audit_log (action, module, record_id, user_id, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(action, module, record_id, user_id, JSON.stringify(oldValue), JSON.stringify(newValue));
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }

  static getLogs(filters = {}) {
    let sql = `
      SELECT al.*, u.username
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.userId) {
      sql += ' AND al.user_id = ?';
      params.push(filters.userId);
    }
    if (filters.module) {
      sql += ' AND al.module = ?';
      params.push(filters.module);
    }
    if (filters.dateFrom) {
      sql += ' AND al.timestamp >= ?';
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      sql += ' AND al.timestamp <= ?';
      params.push(filters.dateTo);
    }

    sql += ' ORDER BY al.timestamp DESC LIMIT 1000';
    return db.prepare(sql).all(...params);
  }
}

module.exports = AuditLog;
