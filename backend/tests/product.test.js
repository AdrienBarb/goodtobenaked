const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../models/productModel');
const Creator = require('../models/creatorModel');
const Member = require('../models/memberModel');
const generateToken = require('../lib/utils/jwt');
const getMember = require('./factory/memberFactory');
const getCreator = require('./factory/creatorFactory');
const getProduct = require('./factory/productFactory');
const productModel = require('../models/productModel');

require('dotenv').config();

let mongoServer;

//Connecting to the database before each test.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

//Closing database connection after each test.
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

//Creating a product before each test.
beforeAll(async () => {});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Get all products', () => {
  test('Should return all products', async () => {
    const creator = await getCreator({});
    const product = await getProduct({ creator });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toEqual(1);
  });

  test('Should return permanent products', async () => {
    const creator = await getCreator({});
    const product = await getProduct({ creator, permanent: true });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toEqual(1);
  });

  test('Should return permanent products event if saleState is sold', async () => {
    const creator = await getCreator({});
    const product = await getProduct({
      creator,
      permanent: true,
      saleState: 'sold',
    });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toEqual(1);
  });

  test('Shouldnt return private products', async () => {
    const creator = await getCreator({});
    const product = await getProduct({ creator, visibility: 'private' });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toEqual(0);
  });

  test('Shouldnt return draft products', async () => {
    const creator = await getCreator({});
    const product = await getProduct({ creator, isDraft: true });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toEqual(0);
  });
});

describe('Get current product', () => {
  test('Get current product', async () => {
    const product = await getProduct({ creator, withOptions: true });

    const res = await request(app).get(`/api/products/${product?._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.userId._id).toBeDefined();
  });
});

describe('Create a product', () => {
  test('A creator can create a product', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);

    const res = await request(app)
      .post('/api/products')
      .auth(creatorToken, { type: 'bearer' })
      .send({
        name: 'Culotte',
        productType: 'physical',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.formStep).toBe(1);
    expect(res.body.isDraft).toBe(true);
  });
});

describe('Edit a product', () => {
  test('A creator can edit a product', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        name: 'Nouvelle culotte',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Nouvelle culotte');
  });
});

describe('Edit a product pricing', () => {
  test('A creator can edit a product pricing without options', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/pricing`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        withOptions: false,
        productPrice: {
          price: 10,
          serviceFee: 1.5,
          serviceFeeVat: 1.8,
          totalPrice: 11.8,
        },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(10);
    expect(res.body.serviceFee).toBe(1.5);
    expect(res.body.serviceFeeVat).toBe(1.8);
    expect(res.body.totalPrice).toBe(11.8);
    expect(res.body.withOptions).toBe(false);
    expect(res.body.formStep).toBe(2);
  });

  test('A creator can edit a product pricing with options', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/pricing`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        withOptions: true,
        packagesValues: [
          {
            description: '',
            name: 'basic',
            options: [
              {
                name: '1er extra',
                additionalCost: 5,
                serviceFee: 0.75,
                serviceFeeVat: 0.9,
                totalAdditionalCost: 5.9,
              },
            ],
            packageOption: {
              name: '',
              additionalCost: null,
              serviceFee: null,
              serviceFeeVat: null,
              totalAdditionalCost: null,
            },
            price: 10,
            serviceFee: 1.5,
            serviceFeeVat: 1.8,
            totalPrice: 11.8,
            title: '1er options',
          },
          {
            description: '',
            name: 'standard',
            options: [
              {
                name: '2eme extra',
                additionalCost: 10,
                serviceFee: 1.5,
                serviceFeeVat: 1.8,
                totalAdditionalCost: 11.8,
              },
            ],
            packageOption: {
              name: '',
              additionalCost: null,
              serviceFee: null,
              serviceFeeVat: null,
              totalAdditionalCost: null,
            },
            price: 20,
            serviceFee: 3,
            serviceFeeVat: 3.6,
            title: '2eme option',
            totalPrice: 23.6,
          },
        ],
      });

    expect(res.statusCode).toBe(200);

    const fetchedProduct = await productModel.findById(product._id).populate({
      path: 'packages',
      model: 'Package',
      populate: {
        path: 'options',
        model: 'Option',
      },
    });

    expect(fetchedProduct.packages.length).toBe(2);
    expect(fetchedProduct.packages[0].price).toBe(10);
    expect(fetchedProduct.packages[0].serviceFee).toBe(1.5);
    expect(fetchedProduct.packages[0].serviceFeeVat).toBe(1.8);
    expect(fetchedProduct.packages[0].totalPrice).toBe(11.8);
    expect(fetchedProduct.packages[0].title).toBe('1er options');
    expect(fetchedProduct.packages[0].options[0].name).toBe('1er extra');
    expect(fetchedProduct.packages[0].options[0].additionalCost).toBe(5);
    expect(fetchedProduct.packages[0].options[0].serviceFee).toBe(0.75);
    expect(fetchedProduct.packages[0].options[0].serviceFeeVat).toBe(0.9);
    expect(fetchedProduct.packages[0].options[0].totalAdditionalCost).toBe(5.9);

    expect(fetchedProduct.packages[1].price).toBe(20);
    expect(fetchedProduct.packages[1].serviceFee).toBe(3);
    expect(fetchedProduct.packages[1].serviceFeeVat).toBe(3.6);
    expect(fetchedProduct.packages[1].totalPrice).toBe(23.6);
    expect(fetchedProduct.packages[1].title).toBe('2eme option');
    expect(fetchedProduct.packages[1].options[0].name).toBe('2eme extra');
    expect(fetchedProduct.packages[1].options[0].additionalCost).toBe(10);
    expect(fetchedProduct.packages[1].options[0].serviceFee).toBe(1.5);
    expect(fetchedProduct.packages[1].options[0].serviceFeeVat).toBe(1.8);
    expect(fetchedProduct.packages[1].options[0].totalAdditionalCost).toBe(
      11.8,
    );
    expect(fetchedProduct.withOptions).toBe(true);
    expect(fetchedProduct.formStep).toBe(2);
  });

  test('A creator cant edit a product pricing with options and bithout packages', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/pricing`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        withOptions: true,
        packagesValues: [],
      });

    expect(res.statusCode).toBe(400);
  });
});

describe('Edit a product details', () => {
  test('A creator can edit a product details', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/details`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        packageSize: 'small',
        duration: '24h',
      });

    expect(res.statusCode).toBe(200);

    const fetchedProduct = await productModel.findById(product._id);
    expect(fetchedProduct.packageSize).toBe('small');
    expect(fetchedProduct.formStep).toBe(3);
  });

  test('A creator can add tags to his product', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/details`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        tags: ['bdsm', 'humiliation'],
        packageSize: 'small',
      });

    expect(res.statusCode).toBe(200);

    const fetchedProduct = await productModel
      .findById(product._id)
      .populate('tags');
    expect(fetchedProduct.tags.length).toBe(2);
  });

  test('A creator cant edit details if physical and packageSize not present', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/details`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        tags: ['bdsm', 'humiliation'],
      });

    expect(res.statusCode).toBe(400);
  });
});

describe('Edit a product gallery', () => {
  test('A creator can edit product gallery', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product._id}/gallery`)
      .auth(creatorToken, { type: 'bearer' })
      .attach('productPicture1', 'tests/fixtures/productPicture1.png')
      .attach('productPicture2', 'tests/fixtures/productPicture1.png')
      .attach('productPicture3', 'tests/fixtures/productPicture1.png')
      .attach('productPicture4', 'tests/fixtures/productPicture1.png');

    expect(res.statusCode).toBe(200);

    const fetchedProduct = await productModel.findById(product._id);
    expect(fetchedProduct.productPicturesKeys.length).toBe(4);
  });
});

describe('Archived a product', () => {
  test('A creator can archived a product', async () => {
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator });

    const res = await request(app)
      .put(`/api/products/${product?._id}/archived`)
      .auth(creatorToken, { type: 'bearer' });

    expect(res.statusCode).toBe(200);
    const fetchedProduct = await Product.findById(product?._id);
    expect(fetchedProduct.isArchived).toBe(true);
  });
});
