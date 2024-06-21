const rosie = require('rosie');
const { faker } = require('@faker-js/faker');
const productModel = require('../../models/productModel');
const optionModel = require('../../models/optionModel');
const packageModel = require('../../models/packageModel');
const Factory = rosie.Factory;

const getProduct = async ({
  creator,
  packageSize,
  saleState,
  productType,
  withOptions,
  isDraft,
  permanent,
  visibility,
}) => {
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

  const ProductFactory = Factory.define('product')
    .attr('userId', creator)
    .attr('name', faker.commerce.productName())
    .attr('productType', productType || 'physical')
    .attr('description', faker.lorem.paragraph())
    .attr('price', 10)
    .attr('serviceFee', 1.5)
    .attr('serviceFeeVat', 1.8)
    .attr('totalPrice', 11.8)
    .attr('productPicturesKeys', [faker.image.imageUrl()])
    .attr('favoriteCounter', faker.datatype.number())
    .attr('saleState', saleState || 'active')
    .attr('withOptions', withOptions || false)
    .attr('isDraft', isDraft || false)
    .attr('permanent', permanent || false)
    .attr('visibility', visibility || 'public')
    .attr('packageSize', packageSize || 'small')
    .attr('packages', withOptions ? [currentPackage] : [])
    .attr('visibleInGeneralListing', faker.datatype.boolean());

  const productAttributes = ProductFactory.build();

  const product = await productModel.create(productAttributes);

  return product;
};

module.exports = getProduct;
