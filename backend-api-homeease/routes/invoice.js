const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// Import correctly named controller functions
const { 
  getInvoices, 
  getInvoiceDetail, 
  addInvoice, 
  updateInvoice, 
  deleteInvoice 
} = require('../controllers/invoiceController');

// Mock payment helpers
const { createPaymentSession, getPaymentStatus, confirmMockPayment } = require('../controllers/invoiceController');

// Define routes
router.get('/', authenticateToken, getInvoices);
router.get('/:id', authenticateToken, getInvoiceDetail);
router.post('/', authenticateToken, authorizeAdmin, addInvoice);
router.put('/:id', authenticateToken, authorizeAdmin, updateInvoice);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteInvoice);

// Mock payment flow endpoints
router.post('/:id/create-payment', authenticateToken, createPaymentSession);
router.get('/:id/payment-status', authenticateToken, getPaymentStatus);
// Public mock-pay page (for QR scanning from phone)
router.get('/mock-pay/:sessionId', /* public */ (req, res, next) => { next(); }, require('../controllers/invoiceController').renderMockPayPage);
// Confirm endpoint is intentionally public to simulate provider callback
router.post('/mock-pay/:sessionId/confirm', confirmMockPayment);

module.exports = router;