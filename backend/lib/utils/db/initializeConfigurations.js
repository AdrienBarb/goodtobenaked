const appConfigurationModel = require('../../../models/appConfigurationModel');

const defaultConfigurations = {
  isMaintenance: false,
  adminIp: '::1',
};

async function initializeConfigurations() {
  await Promise.all(
    Object.entries(defaultConfigurations).map(
      async ([configKey, defaultValue]) => {
        const existingConfig = await appConfigurationModel.findOne({
          _id: configKey,
        });
        if (!existingConfig) {
          const newConfig = new appConfigurationModel({
            _id: configKey,
            data: defaultValue,
          });
          await newConfig.save();
        }
      },
    ),
  );
}

module.exports = initializeConfigurations;
