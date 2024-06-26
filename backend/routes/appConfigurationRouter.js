const express = require('express');

const {
  getAppConfigurations,
  checkIsMaintenance,
} = require('../controllers/appConfigurationController');

const router = express.Router();
router.get('/', getAppConfigurations);
router.get('/is-maintenance', checkIsMaintenance);

module.exports = router;
