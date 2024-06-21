const express = require('express');

const {
  createNude,
  getAllNudes,
  getCurrentNude,
  editNude,
  archivedNude,
  buyNude,
} = require('../controllers/nudeController');
const { userProtect } = require('../middleware/authUserMiddleware');
const {
  identifyUserIfConnected,
} = require('../middleware/identifyUserIfConnected');

const router = express.Router();

router.post('/', userProtect, createNude);
router.get('/', identifyUserIfConnected, getAllNudes);
router.get('/:nudeId', getCurrentNude);
router.put('/:nudeId/archived', userProtect, archivedNude);
router.put('/:nudeId', userProtect, editNude);
router.post('/buy', userProtect, buyNude);

module.exports = router;
