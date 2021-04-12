const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
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

  await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    totalAfterDiscount,
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email });

  const { products } = await Cart.findOne({ orderedBy: user._id });

  const newOrder = await Order.create({
    products,
    paymentIntent,
    orderedBy: user._id,
  });

  // Decrement the quantity, Increment sold
  let bultOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  await Product.bulkWrite(bultOption, {});

  // Empty cart
  await Cart.findOneAndRemove({ orderedBy: user._id });

  res.status(200).json({ status: 'success', newOrder });
});

exports.orders = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });

  const orders = await Order.find({ orderedBy: user._id })
    .sort('-createdAt')
    .populate('products.product');

  res.status(200).json({ status: 'success', orders });
});

// WISHLIST
exports.addToWishList = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  );

  res.status(200).json({
    status: 'success',
  });
});

exports.wishlist = catchAsync(async (req, res, next) => {
  const {wishlist} = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist');

  res.status(200).json({
    status: 'success',
    wishlist,
  });
});

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  );
  res.status(202).json({ status: 'success' });
});
