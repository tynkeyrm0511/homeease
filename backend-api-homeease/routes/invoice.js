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

// Define routes
router.get('/', authenticateToken, getInvoices);
router.get('/:id', authenticateToken, getInvoiceDetail);
router.post('/', authenticateToken, authorizeAdmin, addInvoice);
router.put('/:id', authenticateToken, authorizeAdmin, updateInvoice);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteInvoice);

module.exports = router;