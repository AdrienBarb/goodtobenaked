const asyncHandler = require('express-async-handler');
const Tag = require('../models/tagModel');
const genderCategoryModel = require('../models/genderCategoryModel');
const productModel = require('../models/productModel');

const getAllTags = asyncHandler(async (req, res, next) => {
  const tags = await Tag.find();

  const formattedTags = tags.map((currentTags) => currentTags.name);

  res.status(200).json(formattedTags);
});

const getGenderCategories = asyncHandler(async (req, res, next) => {
  const genders = await genderCategoryModel.find();

  res.status(200).json(genders);
});

const getTopCategories = asyncHandler(async (req, res, next) => {
  const topCategories = await productModel.aggregate([
    {
      $match: {
        category: { $nin: [null, ''] }, // Ne match que les documents où 'category' n'est ni null ni une chaîne vide
      },
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  res.status(200).json(topCategories);
});

module.exports = {
  getAllTags,
  getGenderCategories,
  getTopCategories,
};
