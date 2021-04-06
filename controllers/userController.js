const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.userCart = catchAsync(async (req, res) => {
  const { cart } = req.body;

  let products = [];
  const user = await User.findOne({ email: req.user.email });
  // check if cart with logged in user id already exist
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id });
  if (cartExistByThisUser) {
    cartExistByThisUser.remove();
  }
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for creating total
    const { price } = await Product.findById(cart[i]._id).select('price');
    object.price = price;
    total += price * cart[i].count;
    products.push(object);
  }

  const newCart = await Cart.create({
    products,
    cartTotal: total,
    totalAfterDiscount: total,
    orderedBy: user._id,
  });

  res.status(201).json({
    status: 'success',
    cart: newCart,
  });
});

exports.getUserCart = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const cart = await Cart.findOne({ orderedBy: user._id }).populate(
    'products.product',
    '_id title price'
  );
  const { products, cartTotal, totalAfterDiscount } = cart;
  res.status(200).json({
    status: 'success',
    products,
    cartTotal,
    totalAfterDiscount,
  });
});

exports.saveAddress = catchAsync(async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  );
  res.status(200).json({
    status: 'success',
    address: userAddress,
  });
});

exports.applyCouponToUserCart = catchAsync(async (req, res, next) => {
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) {
    // return res.status(404).json({
    //   status: 'failed',
    //   message: 'Invalid Coupon',
    // });
    return next(new AppError('Invalid coupon', 404));
  }
  const user = await User.findOne({ email: req.user.email });

  const { products, cartTotal } = await Cart.findOne({
    orderedBy: user._id,
  }).populate('products.product', '_id title price');

  // total after discount
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    totalAfterDiscount,
  });
});
