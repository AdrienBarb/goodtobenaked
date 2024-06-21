const Order = require('../../../models/orderModel');

const fetchOrder = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('seller')
    .populate('buyer')
    .populate('product')
    .populate('package')
    .populate('options')
    .populate('deliveryAddress')
    .populate('activities');

  if (!order) {
    throw new Error('Data not found');
  }

  return order;
};

module.exports = {
  fetchOrder,
};
