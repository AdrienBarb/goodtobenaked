const express = require('express');

const {
  createInvoice,
  downloadInvoice,
  getInvoices,
  getBalances,
  getSales,
} = require('../controllers/incomeController');
const { userProtect } = require('../middleware/authUserMiddleware');

const router = express.Router();

router.get('/balances', userProtect, getBalances);
router.get('/sales', userProtect, getSales);
router.get('/invoices', userProtect, getInvoices);
router.post('/create-invoice', userProtect, createInvoice);
router.get('/invoices/:invoiceId', userProtect, downloadInvoice);

module.exports = router;
