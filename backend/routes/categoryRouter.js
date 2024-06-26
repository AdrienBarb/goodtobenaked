const express = require('express');

const {
  getAllTags,
  getGenderCategories,
  getTopCategories,
} = require('../controllers/categoryController');

const router = express.Router();
router.get('/tags', getAllTags);
router.get('/genders', getGenderCategories);
router.get('/top-categories', getTopCategories);

module.exports = router;
