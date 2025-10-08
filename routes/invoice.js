const express = require('express');
const router = express.Router();
const { getInvoices, addInvoice, updateInvoice, deleteInvoice, getInvoiceDetail } = require('../controllers/invoiceController');
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/authMiddleware');

// Admin: get all invoices
router.get('/', authenticateToken, authorizeAdmin, getInvoices);

// Admin: add a new invoice
router.post('/add', authenticateToken, authorizeAdmin, addInvoice);

// Admin: update invoice
router.put('/:id', authenticateToken, authorizeAdmin, updateInvoice);

// Admin: delete invoice
router.delete('/:id', authenticateToken, authorizeAdmin, deleteInvoice);

// Admin or resident: get invoice detail
router.get('/:id', authenticateToken, authorizeSelfOrAdmin, getInvoiceDetail);

module.exports = router;