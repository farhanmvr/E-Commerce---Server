const Coupon = require('../models/couponModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.create = catchAsync(async (req, res, next) => {
  const { name, expiry, discount } = req.body;

  const coupon = await new Coupon({
    name,
    expiry,
    discount,
  }).save();
  res.status(200).json({
    status: 'success',
    coupon,
  });
});

exports.list = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    coupons,
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const deleted = await Coupon.findByIdAndDelete(req.params.couponId);
  if (!deleted) return next(new AppError('Invalid id'));
  res.status(204).json({
    status: 'success',
    coupon: deleted,
  });
});
