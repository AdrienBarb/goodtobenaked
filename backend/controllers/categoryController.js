const asyncHandler = require('express-async-handler');
const Tag = require('../models/tagModel');
const genderCategoryModel = require('../models/genderCategoryModel');

const getAllTags = asyncHandler(async (req, res, next) => {
  const tags = await Tag.find();

  const formattedTags = tags.map((currentTags) => currentTags.name);

  res.status(200).json(formattedTags);
});

const getGenderCategories = asyncHandler(async (req, res, next) => {
  const genders = await genderCategoryModel.find();

  res.status(200).json(genders);
});

module.exports = {
  getAllTags,
  getGenderCategories,
};
