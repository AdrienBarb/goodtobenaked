const express = require('express');

const {
  createMedia,
  getAllMedias,
  deleteMedia,
  generateUploadUrl,
} = require('../controllers/mediaController');
const { userProtect } = require('../middleware/authUserMiddleware');

const router = express.Router();

router.post('/', userProtect, createMedia);
router.get('/', userProtect, getAllMedias);
router.put('/archived', userProtect, deleteMedia);
router.post('/generate-upload-url', userProtect, generateUploadUrl);

module.exports = router;
