const { Factory } = require('rosie');
const saleModel = require('../../models/saleModel');
const mongoose = require('mongoose');
const moment = require('moment');

const SaleFactory = new Factory()
  .attr('owner', () => new mongoose.Types.ObjectId())
  .attr('fromUser', () => new mongoose.Types.ObjectId())
  .attr('saleType', 'nude')
  .attr('nude', () => new mongoose.Types.ObjectId())
  .attr('isPaid', false)
  .attr('availableDate', moment.utc().add(7, 'days').startOf('day').toDate())
  .attr('amount', () => ({
    fiatValue: 1000,
    creditValue: 1000,
    currency: 'EUR',
  }));

const createSale = async ({
  owner,
  saleType = 'nude',
  isPaid = false,
  amount = { fiatValue: 1000, creditValue: 1000, currency: 'EUR' },
  availableDate = moment.utc().add(7, 'days').startOf('day').toDate(),
}) => {
  const saleData = SaleFactory.build({
    owner,
    saleType,
    isPaid,
    amount,
    availableDate,
  });
  const sale = new saleModel(saleData);
  return sale.save();
};

module.exports = createSale;
