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
} = require('../controllers/subController');

// Public
router.get('/subs', list);
router.get('/sub/:slug', read);

// Restric to admin
router.post('/sub', authCheck, adminCheck, create);
router
  .route('/sub/:slug')
  .put(authCheck, adminCheck, update)
  .delete(authCheck, adminCheck, remove);

module.exports = router;
