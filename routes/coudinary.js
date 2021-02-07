const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/authMiddleware');

// controllers
const {
  upload,
  remove,
} = require('../controllers/cloudinaryController');

// Admin access
router.post('/upload-images',authCheck,adminCheck,upload)
router.post('/remove-images',authCheck,adminCheck,remove)

module.exports = router;
