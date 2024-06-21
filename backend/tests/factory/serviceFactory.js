// serviceOrderFactory.js
const mongoose = require('mongoose');
const rosie = require('rosie');
const { faker } = require('@faker-js/faker');

const Factory = rosie.Factory;
const ServiceOrder = require('../../models/serviceOrder');
const optionModel = require('../../models/optionModel');
const packageModel = require('../../models/packageModel');
const serviceModel = require('../../models/serviceModel');

const getService = async (creator) => {
  const options1 = await optionModel.create({
    name: '24h',
    additionalCost: 10,
    serviceFee: 1.5,
    serviceFeeVat: 1.8,
    totalAdditionalCost: 11.8,
  });

  const options2 = await optionModel.create({
    name: '48h',
    additionalCost: 10,
    serviceFee: 1.5,
    serviceFeeVat: 1.8,
    totalAdditionalCost: 11.8,
  });

  const options3 = await optionModel.create({
    name: '72h',
    additionalCost: 10,
    serviceFee: 1.5,
    serviceFeeVat: 1.8,
    totalAdditionalCost: 11.8,
  });

  const currentPackage = await packageModel.create({
    name: 'basic',
    title: 'Je vends mes culottes',
    description: 'Belle culottes',
    price: 10,
    serviceFee: 1.5,
    serviceFeeVat: 1.8,
    totalPrice: 11.8,
    options: [options1, options2, options3],
  });

  const newService = new serviceModel({
    creator: creator,
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    category: faker.commerce.department(),
    subCategory: faker.commerce.productMaterial(),
    imageKeys: ['www.google.com'],
    step: faker.datatype.number({ min: 0, max: 10 }),
    packages: [currentPackage],
    isDraft: faker.datatype.boolean(),
    rate: faker.datatype.number({ min: 0, max: 5 }),
    rateCount: faker.datatype.number({ min: 0, max: 100 }),
    packageSize: faker.helpers.arrayElement(['small', 'medium', 'big']),
  });

  return newService.save();
};

module.exports = getService;
