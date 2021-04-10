const express = require('express');
const router = express.Router();

const { createPaymentIntent } = require('../controllers/stripeController');

const { authCheck } = require('../middlewares/authMiddleware');

router.post('/create-payment-intent', authCheck, createPaymentIntent);

module.exports = router;
