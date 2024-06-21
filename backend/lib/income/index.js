const Order = require("../../models/orderModel");

const getUnpaidOrders = async (sellerId) => {
    const unpaidOrders = Order.find({ haveBeenPaid: false, succeed: true, seller: sellerId, state: 'completed' }).populate('product')

    return unpaidOrders
}

module.exports = {
    getUnpaidOrders
}