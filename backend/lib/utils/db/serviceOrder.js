const ServiceOrder = require("../../../models/serviceOrder");

const fetchServiceOrder = async (serviceOrderId) => {
    const serviceOrder = await ServiceOrder.findById(serviceOrderId)
      .populate('buyer')
      .populate('seller')
      .populate('service')
      .populate('package')
      .populate('options')
      .populate('activities')
      .populate('privateService')
      .populate('deliveryAddress')
  
    if (!serviceOrder) {
      throw new Error("Data not found");
    }
  
    return serviceOrder;
}

module.exports = {
    fetchServiceOrder
}