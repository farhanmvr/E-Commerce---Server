const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/authMiddleware');

// controllers
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters
} = require('../controllers/productController');

router.post('/product', authCheck, adminCheck, create);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);
router.get('/products/total', productsCount);
router.get('/products/:count', listAll);
router.post('/products', list);

// rating
router.put('/product/star/:productId',authCheck,productStar)
// retated product
router.get('/product/related/:productId',listRelated)
// search
router.post('/search/filters',searchFilters)

module.exports = router;
