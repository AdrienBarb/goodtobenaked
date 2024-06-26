// serviceOrderFactory.js
const mongoose = require('mongoose');
const rosie = require('rosie');
const { faker } = require('@faker-js/faker');

const Factory = rosie.Factory;
const ServiceOrder = require('../../models/serviceOrder');
const serviceOrder = require('../../models/serviceOrder');

const getServiceOrder = async (
  seller,
  buyer,
  state,
  status,
  service,
  privateService,
) => {
  const newServiceOrder = new serviceOrder({
    seller: seller,
    buyer: buyer,
    state: state || 'new',
    status: status || 'initialized',
    service: service,
    privateService: privateService,
    package: service.packages[0],
    options: [service.packages[0].options[0], service.packages[0].options[1]],
    cost: faker.commerce.price(),
    deliveryCost: faker.commerce.price(),
    activities: [],
    haveBeenPaid: faker.datatype.boolean(),
    deliveryAddress: mongoose.Types.ObjectId(),
    instruction: faker.lorem.sentence(),
  });

  return newServiceOrder.save();
};

module.exports = getServiceOrder;
