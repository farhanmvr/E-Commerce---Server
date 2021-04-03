const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/authMiddleware');
const {
  userCart,
  getUserCart,
  saveAddress,
} = require('../controllers/userController');

router
  .post('/user/cart', authCheck, userCart)
  .get('/user/cart', authCheck, getUserCart);
router.post('/user/address', authCheck, saveAddress);

// router.get('/user', (req, res) => {
//   res.json({
//     data: 'Hit user route',
//   });
// });

module.exports = router;
