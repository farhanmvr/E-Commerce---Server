const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.orders = catchAsync(async (req, res) => {
  const orders = await Order.find({})
    .sort('-createdAt')
    .populate('products.product');

  res.status(200).json({
    status: 'success',
    orders,
  });
});

exports.orderStatus = catchAsync(async (req, res, next) => {
  const { orderId, orderStatus } = req.body;
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );

  if (!updatedOrder) next(new AppError('Invalid Id', 400));

  res.status(200).json({
    status: 'success',
    order: updatedOrder,
  });
});
