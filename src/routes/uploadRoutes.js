const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, upload.array('images', 8), uploadImages);
router.post('/delete', protect, adminOnly, deleteImage);

module.exports = router;
