const express = require('express');

const {
  createCypressSeed,
  deleteCypressSeed,
} = require('../controllers/testsController');

const router = express.Router();
router.post('/create-seed', createCypressSeed);
router.post('/delete-seed', deleteCypressSeed);

module.exports = router;
