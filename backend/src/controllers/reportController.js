const AuditLog = require('../models/AuditLog');

class ReportController {
  static getAuditLogs(req, res) {
    try {
      const filters = {
        userId: req.query.userId,
        module: req.query.module,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };
      res.json(AuditLog.getLogs(filters));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static exportToExcel(req, res) {
    try {
      const XLSX = require('xlsx');
      const InventoryItem = require('../models/InventoryItem');

      const inventory = InventoryItem.getInventoryStatus();
      const worksheet = XLSX.utils.json_to_sheet(inventory);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

      res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static exportToPDF(req, res) {
    try {
      const PDFDocument = require('pdfkit');
      const InventoryItem = require('../models/InventoryItem');

      const inventory = InventoryItem.getInventoryStatus();
      const doc = new PDFDocument();

      res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      doc.fontSize(20).text('Yarn Inventory Report', { align: 'center' });
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text('Inventory Summary', { underline: true });
      const totalCones = inventory.reduce((sum, item) => sum + item.received_cones, 0);
      const totalWeight = inventory.reduce((sum, item) => sum + (item.received_weight || 0), 0);
      const totalIssued = inventory.reduce((sum, item) => sum + item.issued_cones, 0);

      doc.fontSize(10).text(`Total Cones: ${totalCones}`);
      doc.text(`Total Weight: ${totalWeight.toFixed(2)} kg`);
      doc.text(`Total Issued: ${totalIssued}`);
      doc.moveDown();

      doc.fontSize(10).text('Inventory Details', { underline: true });
      doc.moveDown();

      const headers = ['Lot#', 'Yarn Name', 'Style', 'Received', 'Issued', 'Available'];
      const columnWidths = [60, 100, 80, 60, 60, 60];
      let x = 50;

      headers.forEach((header, i) => {
        doc.text(header, x, doc.y, { width: columnWidths[i] });
        x += columnWidths[i];
      });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();
      doc.moveDown();

      inventory.slice(0, 50).forEach(item => {
        x = 50;
        const data = [
          item.lot_number || '',
          (item.yarn_name || '').substring(0, 15),
          item.style || '',
          item.received_cones || 0,
          item.issued_cones || 0,
          (item.received_cones - item.issued_cones - item.rejected_cones) || 0
        ];
        data.forEach((cell, i) => {
          doc.text(cell.toString(), x, doc.y, { width: columnWidths[i] });
          x += columnWidths[i];
        });
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReportController;
