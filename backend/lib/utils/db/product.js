const Product = require('../../../models/productModel');

const fetchProduct = async (productId) => {
  const product = await Product.findById(productId)
    .populate('userId')
    .populate('favoriteUsers')
    .populate('tags')
    .populate({
      path: 'packages',
      model: 'Package',
      populate: {
        path: 'options',
        model: 'Option',
      },
    });

  if (!product) {
    throw new Error('Data not found');
  }

  return product;
};

module.exports = {
  fetchProduct,
};
