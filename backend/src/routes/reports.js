const express = require('express');
const ReportController = require('../controllers/reportController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/audit-logs', authenticateToken, authorize('admin'), ReportController.getAuditLogs);
router.get('/export/excel', authenticateToken, ReportController.exportToExcel);
router.get('/export/pdf', authenticateToken, ReportController.exportToPDF);

module.exports = router;
