const { Factory } = require('rosie');
const saleModel = require('../../models/saleModel');
const mongoose = require('mongoose');

const SaleFactory = new Factory()
  .attr('owner', () => new mongoose.Types.ObjectId())
  .attr('fromUser', () => new mongoose.Types.ObjectId())
  .attr('saleType', 'nude')
  .attr('nude', () => new mongoose.Types.ObjectId())
  .attr('isPaid', false)
  .attr('amount', () => ({
    fiatValue: 1000,
    creditValue: 1000,
    currency: 'EUR',
  }));

const createSale = async ({ owner, saleType = 'nude', isPaid, amount }) => {
  const saleData = SaleFactory.build({ owner, saleType, isPaid, amount });
  const sale = new saleModel(saleData);
  return sale.save();
};

module.exports = createSale;
