const stripe = require('stripe')(process.env.STRIPE_SECRET);

const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { couponApplied } = req.body;
  const user = await User.findOne({ email: req.user.email });
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount:
      couponApplied && totalAfterDiscount
        ? Math.round(totalAfterDiscount * 100)
        : cartTotal * 100,
    currency: 'inr',
  });

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret,
    total: paymentIntent.amount,
  });
});
