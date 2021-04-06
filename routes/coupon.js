const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/authMiddleware');

// controllers
const {
  create,
  remove,
  list,
} = require('../controllers/couponController');

router.get('/coupons', list);
// Restric to admin
router.post('/coupon', authCheck, adminCheck, create);
router.delete('/coupon/:couponId', authCheck, adminCheck, remove);

module.exports = router;
