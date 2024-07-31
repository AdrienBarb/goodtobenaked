const express = require('express');

const {
  getAllTags,
  getGenderCategories,
} = require('../controllers/categoryController');

const router = express.Router();
router.get('/tags', getAllTags);
router.get('/genders', getGenderCategories);

module.exports = router;
