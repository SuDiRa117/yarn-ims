const db = require('../config/database');

class InventoryItem {
  // Received Yarn
  static createReceivedYarn({ lot_number, style, yarn_name, weight_kg, number_of_cones, colour, date_received, notes, created_by }) {
    const result = db.prepare(
      `INSERT INTO received_yarn (lot_number, style, yarn_name, weight_kg, number_of_cones, colour, date_received, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(lot_number, style, yarn_name, weight_kg, number_of_cones, colour, date_received, notes, created_by);
    return result.lastInsertRowid;
  }

  static getReceivedYarn(id) {
    return db.prepare('SELECT * FROM received_yarn WHERE id = ?').get(id);
  }

  static getAllReceivedYarn() {
    return db.prepare('SELECT * FROM received_yarn ORDER BY date_received DESC').all();
  }

  // Issued Yarn
  static createIssuedYarn({ received_yarn_id, lot_number, issued_to, quantity_issued, purpose, issue_date, expected_return_date, issued_by }) {
    const result = db.prepare(
      `INSERT INTO issued_yarn (received_yarn_id, lot_number, issued_to, quantity_issued, purpose, issue_date, expected_return_date, issued_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(received_yarn_id, lot_number, issued_to, quantity_issued, purpose, issue_date, expected_return_date, issued_by);
    return result.lastInsertRowid;
  }

  static getIssuedYarnByLot(lot_number) {
    return db.prepare('SELECT * FROM issued_yarn WHERE lot_number = ?').all(lot_number);
  }

  // Rejected Yarn
  static createRejectedYarn({ received_yarn_id, lot_number, rejection_reason, rejection_details, severity_level, can_be_reused, rejection_date, rejected_by }) {
    const result = db.prepare(
      `INSERT INTO rejected_yarn (received_yarn_id, lot_number, rejection_reason, rejection_details, severity_level, can_be_reused, rejection_date, rejected_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(received_yarn_id, lot_number, rejection_reason, rejection_details, severity_level, can_be_reused ? 1 : 0, rejection_date, rejected_by);
    return result.lastInsertRowid;
  }

  static getRejectedYarnByLot(lot_number) {
    return db.prepare('SELECT * FROM rejected_yarn WHERE lot_number = ?').all(lot_number);
  }

  // QC Yarn
  static createQCYarn({ received_yarn_id, lot_number, test_type, test_status, expected_completion_date, tested_by }) {
    const result = db.prepare(
      `INSERT INTO qc_yarn (received_yarn_id, lot_number, test_type, test_status, expected_completion_date, tested_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(received_yarn_id, lot_number, test_type, test_status, expected_completion_date, tested_by);
    return result.lastInsertRowid;
  }

  static getQCYarnByLot(lot_number) {
    return db.prepare('SELECT * FROM qc_yarn WHERE lot_number = ?').all(lot_number);
  }

  static updateQCStatus(qc_id, test_status, test_result, tested_by) {
    const result = db.prepare(
      `UPDATE qc_yarn SET test_status = ?, test_result = ?, tested_by = ?, test_date = datetime('now') WHERE id = ?`
    ).run(test_status, test_result, tested_by, qc_id);
    return result.changes > 0;
  }

  // Stock calculations
  static getInventoryStatus() {
    const rows = db.prepare(`
      SELECT
        r.id,
        r.lot_number,
        r.yarn_name,
        r.style,
        r.colour,
        r.number_of_cones as received_cones,
        ROUND(r.weight_kg * r.number_of_cones, 2) as received_weight,
        r.date_received,
        r.updated_at,
        COALESCE(SUM(CASE WHEN i.actual_return_date IS NULL THEN i.quantity_issued ELSE 0 END), 0) as issued_cones,
        COALESCE((SELECT COUNT(*) FROM rejected_yarn rj WHERE rj.received_yarn_id = r.id), 0) as rejected_cones,
        COALESCE(COUNT(CASE WHEN qc.test_status NOT IN ('Completed', 'Failed') THEN 1 END), 0) as qc_pending
      FROM received_yarn r
      LEFT JOIN issued_yarn i ON r.id = i.received_yarn_id
      LEFT JOIN qc_yarn qc ON r.id = qc.received_yarn_id
      GROUP BY r.id
    `).all();

    return rows.map(row => ({
      ...row,
      available_balance: row.received_cones - row.issued_cones - row.rejected_cones
    }));
  }

  static searchInventory(query, filters = {}) {
    let sql = `
      SELECT
        r.id,
        r.lot_number,
        r.yarn_name,
        r.style,
        r.colour,
        r.number_of_cones as received_cones,
        ROUND(r.weight_kg * r.number_of_cones, 2) as received_weight,
        r.date_received,
        COALESCE(SUM(CASE WHEN i.actual_return_date IS NULL THEN i.quantity_issued ELSE 0 END), 0) as issued_cones,
        COALESCE((SELECT COUNT(*) FROM rejected_yarn rj WHERE rj.received_yarn_id = r.id), 0) as rejected_cones
      FROM received_yarn r
      LEFT JOIN issued_yarn i ON r.id = i.received_yarn_id
      WHERE 1=1
    `;
    const params = [];

    if (query) {
      sql += ' AND (r.lot_number LIKE ? OR r.yarn_name LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }
    if (filters.style) {
      sql += ' AND r.style = ?';
      params.push(filters.style);
    }
    if (filters.colour) {
      sql += ' AND r.colour = ?';
      params.push(filters.colour);
    }
    if (filters.dateFrom) {
      sql += ' AND r.date_received >= ?';
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      sql += ' AND r.date_received <= ?';
      params.push(filters.dateTo);
    }

    sql += ' GROUP BY r.id ORDER BY r.date_received DESC';
    return db.prepare(sql).all(...params);
  }
}

module.exports = InventoryItem;
