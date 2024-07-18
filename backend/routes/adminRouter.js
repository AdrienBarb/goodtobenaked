const express = require('express');

const {
  getCurrentCreatorIdentityCheck,
  changeVerificationState,
  payCreator,
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/authAdminMiddleware');

const router = express.Router();
router.get(
  '/creators/:creatorId',
  adminProtect,
  getCurrentCreatorIdentityCheck,
);
router.put(
  '/creators/:creatorId/change-verification-state',
  adminProtect,
  changeVerificationState,
);
router.post('/invoices/:invoiceId', adminProtect, payCreator);

module.exports = router;
