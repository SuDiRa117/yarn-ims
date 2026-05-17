const InventoryItem = require('../models/InventoryItem');
const AuditLog = require('../models/AuditLog');

class InventoryController {
  // Received Yarn
  static createReceivedYarn(req, res) {
    try {
      const { lot_number, style, yarn_name, weight_kg, number_of_cones, colour, date_received, notes } = req.body;

      const id = InventoryItem.createReceivedYarn({
        lot_number, style, yarn_name, weight_kg, number_of_cones, colour, date_received, notes,
        created_by: req.user.id
      });

      AuditLog.log('CREATE', 'received_yarn', id, req.user.id, null, { lot_number, style, yarn_name });
      res.status(201).json({ id, message: 'Yarn received recorded' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static getReceivedYarn(req, res) {
    try {
      res.json(InventoryItem.getAllReceivedYarn());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Issued Yarn
  static createIssuedYarn(req, res) {
    try {
      const { received_yarn_id, lot_number, issued_to, quantity_issued, purpose, issue_date, expected_return_date } = req.body;

      const receivedYarn = InventoryItem.getReceivedYarn(received_yarn_id);
      const issuedYarns = InventoryItem.getIssuedYarnByLot(lot_number);
      const totalIssued = issuedYarns.reduce((sum, item) => sum + item.quantity_issued, 0);

      if (totalIssued + quantity_issued > receivedYarn.number_of_cones) {
        return res.status(400).json({ error: 'Insufficient stock available' });
      }

      const id = InventoryItem.createIssuedYarn({
        received_yarn_id, lot_number, issued_to, quantity_issued, purpose, issue_date,
        expected_return_date, issued_by: req.user.id
      });

      AuditLog.log('CREATE', 'issued_yarn', id, req.user.id, null, { lot_number, issued_to, quantity_issued });
      res.status(201).json({ id, message: 'Yarn issued recorded' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Rejected Yarn
  static createRejectedYarn(req, res) {
    try {
      const { received_yarn_id, lot_number, rejection_reason, rejection_details, severity_level, can_be_reused, rejection_date } = req.body;

      const id = InventoryItem.createRejectedYarn({
        received_yarn_id, lot_number, rejection_reason, rejection_details,
        severity_level, can_be_reused, rejection_date, rejected_by: req.user.id
      });

      AuditLog.log('CREATE', 'rejected_yarn', id, req.user.id, null, { lot_number, rejection_reason, severity_level });
      res.status(201).json({ id, message: 'Yarn rejection recorded' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // QC Yarn
  static createQCYarn(req, res) {
    try {
      const { received_yarn_id, lot_number, test_type, test_status, expected_completion_date } = req.body;

      const id = InventoryItem.createQCYarn({
        received_yarn_id, lot_number, test_type,
        test_status: test_status || 'Pending',
        expected_completion_date, tested_by: req.user.id
      });

      AuditLog.log('CREATE', 'qc_yarn', id, req.user.id, null, { lot_number, test_type });
      res.status(201).json({ id, message: 'QC record created' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static updateQCStatus(req, res) {
    try {
      const { qc_id } = req.params;
      const { test_status, test_result } = req.body;

      const updated = InventoryItem.updateQCStatus(qc_id, test_status, test_result, req.user.id);

      if (updated) {
        AuditLog.log('UPDATE', 'qc_yarn', qc_id, req.user.id, null, { test_status, test_result });
        res.json({ message: 'QC status updated' });
      } else {
        res.status(404).json({ error: 'QC record not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Stock View
  static getInventoryStatus(req, res) {
    try {
      res.json(InventoryItem.getInventoryStatus());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Search & Filter
  static searchInventory(req, res) {
    try {
      const { q } = req.query;
      const filters = {
        style: req.query.style,
        colour: req.query.colour,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };
      res.json(InventoryItem.searchInventory(q, filters));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Analytics
  static getAnalytics(req, res) {
    try {
      const inventory = InventoryItem.getInventoryStatus();

      const analytics = {
        summary: {
          totalCones: inventory.reduce((sum, item) => sum + item.received_cones, 0),
          totalWeight: inventory.reduce((sum, item) => sum + (item.received_weight || 0), 0),
          totalIssued: inventory.reduce((sum, item) => sum + item.issued_cones, 0),
          totalRejected: inventory.reduce((sum, item) => sum + item.rejected_cones, 0),
          totalQCPending: inventory.reduce((sum, item) => sum + item.qc_pending, 0),
          turnoverRate: 0
        },
        statusDistribution: {
          received: inventory.reduce((sum, item) => sum + item.received_cones, 0),
          issued: inventory.reduce((sum, item) => sum + item.issued_cones, 0),
          rejected: inventory.reduce((sum, item) => sum + item.rejected_cones, 0),
          qc: inventory.reduce((sum, item) => sum + item.qc_pending, 0)
        },
        styleDistribution: {},
        colourDistribution: {}
      };

      inventory.forEach(item => {
        analytics.styleDistribution[item.style] = (analytics.styleDistribution[item.style] || 0) + (item.available_balance || 0);
        analytics.colourDistribution[item.colour] = (analytics.colourDistribution[item.colour] || 0) + (item.available_balance || 0);
      });

      if (analytics.summary.totalCones > 0) {
        analytics.summary.turnoverRate = (analytics.summary.totalIssued / analytics.summary.totalCones) * 100;
      }

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = InventoryController;
