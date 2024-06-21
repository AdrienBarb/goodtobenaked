const asyncHandler = require('express-async-handler');
const appConfigurationModel = require('../models/appConfigurationModel');

const getAppConfigurations = asyncHandler(async (req, res, next) => {
  const configs = await appConfigurationModel.find({});

  const configObject = configs.reduce((acc, config) => {
    acc[config._id] = config.data;
    return acc;
  }, {});

  res.status(200).json(configObject);
});

const checkIsMaintenance = asyncHandler(async (req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'];

  const maintenanceConfig = await appConfigurationModel.findById(
    'isMaintenance',
  );
  const adminIpConfig = await appConfigurationModel.findById('adminIp');

  const isMaintenanceModeActive = maintenanceConfig && maintenanceConfig.data;
  const adminIp = adminIpConfig && adminIpConfig.data;

  const shouldAllowAccess = clientIp === adminIp || !isMaintenanceModeActive;

  res.status(200).json(shouldAllowAccess);
});

module.exports = {
  getAppConfigurations,
  checkIsMaintenance,
};
