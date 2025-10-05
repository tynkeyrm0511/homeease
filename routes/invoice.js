const express = require('express');
const { getInvoices, getInvoiceDetail, addInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const router = express.Router();

//Route: get all invoices
router.get('/', getInvoices);
//Route: get invoice detail
router.get('/:id', getInvoiceDetail);

//Route: add a new invoice
router.post('/add', addInvoice);

//Route: update invoice
router.put('/:id', updateInvoice);

//Route: delete invoice
router.delete('/:id', deleteInvoice);

module.exports = router;