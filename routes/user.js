const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/authMiddleware');
const {
  userCart,
  getUserCart,
  saveAddress,
  applyCouponToUserCart,
} = require('../controllers/userController');

router
  .post('/user/cart', authCheck, userCart)
  .get('/user/cart', authCheck, getUserCart);
router.post('/user/address', authCheck, saveAddress);

router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

module.exports = router;
