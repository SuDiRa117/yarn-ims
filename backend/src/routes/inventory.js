const express = require('express');
const InventoryController = require('../controllers/inventoryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Received Yarn
router.post('/received', authenticateToken, InventoryController.createReceivedYarn);
router.get('/received', authenticateToken, InventoryController.getReceivedYarn);

// Issued Yarn
router.post('/issued', authenticateToken, InventoryController.createIssuedYarn);

// Rejected Yarn
router.post('/rejected', authenticateToken, InventoryController.createRejectedYarn);

// QC Yarn
router.post('/qc', authenticateToken, InventoryController.createQCYarn);
router.put('/qc/:qc_id', authenticateToken, InventoryController.updateQCStatus);

// Stock & Search
router.get('/status', authenticateToken, InventoryController.getInventoryStatus);
router.get('/search', authenticateToken, InventoryController.searchInventory);

// Analytics
router.get('/analytics', authenticateToken, InventoryController.getAnalytics);

module.exports = router;
