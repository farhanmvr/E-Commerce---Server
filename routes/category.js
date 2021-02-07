const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/authMiddleware');

// controllers
const {
  create,
  read,
  update,
  remove,
  list,
  getSubs
} = require('../controllers/categoryController');

// Public
router.get('/categories', list);
router.get('/category/:slug', read);

// Restric to admin
router.post('/category', authCheck, adminCheck, create);
router
  .route('/category/:slug')
  .put(authCheck, adminCheck, update)
  .delete(authCheck, adminCheck, remove);
router.get('/category/subs/:_id',getSubs);

module.exports = router;
