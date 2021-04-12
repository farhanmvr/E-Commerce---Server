const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/authMiddleware');
const {
  userCart,
  getUserCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishList,
  wishlist,
  removeFromWishlist,
} = require('../controllers/userController');

router
  .post('/user/cart', authCheck, userCart)
  .get('/user/cart', authCheck, getUserCart);
router.post('/user/address', authCheck, saveAddress);

router.post('/user/order', authCheck, createOrder);
router.get('/user/orders', authCheck, orders);

router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

// Wishlist
router.post('/user/wishlist', authCheck, addToWishList);
router.get('/user/wishlist', authCheck, wishlist);
router.delete('/user/wishlist/:productId', authCheck, removeFromWishlist);

module.exports = router;
