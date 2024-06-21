const rosie = require('rosie');
const { faker } = require('@faker-js/faker');
const productModel = require('../../models/productModel');
const orderModel = require('../../models/orderModel');
const Factory = rosie.Factory;

const getOrder = async (seller, buyer, product, state, status) => {
  const OrderFactory = Factory.define('order')
    .attr('seller', seller)
    .attr('buyer', buyer)
    .attr('product', product)
    .attr('state', state)
    .attr('status', status)
    .attr('acceptedAt', faker.date.recent())
    .attr('createdAt', faker.date.past())
    .attr('haveBeenPaid', faker.datatype.boolean())
    .attr('instruction', faker.lorem.sentence())
    .attr('cost', faker.commerce.price())
    .attr('deliveryCost', faker.commerce.price());

  const orderAttributes = OrderFactory.build();

  const order = await orderModel.create(orderAttributes);

  return order;
};

module.exports = getOrder;
