const rosie = require('rosie');
const { faker } = require('@faker-js/faker');
const productModel = require('../../models/productModel');
const orderModel = require('../../models/orderModel');
const Factory = rosie.Factory;

const getOrder = async ({
  seller,
  buyer,
  product,
  state,
  status,
  withOptions = false,
  selectedPackage,
  options = [],
}) => {
  const OrderFactory = Factory.define('order')
    .attr('seller', seller)
    .attr('buyer', buyer)
    .attr('product', product)
    .attr('state', state || 'new')
    .attr('status', status || 'initialized')
    .attr('acceptedAt', faker.date.recent())
    .attr('createdAt', faker.date.past())
    .attr('haveBeenPaid', faker.datatype.boolean())
    .attr('withOptions', withOptions)
    .attr('instruction', faker.lorem.sentence())
    .attr('cost', faker.commerce.price())
    .attr('package', selectedPackage)
    .attr('options', options)
    .attr('deliveryCost', 2);

  const orderAttributes = OrderFactory.build();

  const order = await orderModel.create(orderAttributes);

  return order;
};

module.exports = getOrder;
