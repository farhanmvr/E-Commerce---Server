const slugify = require('slugify');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndRemove({ slug: req.params.slug });
  res.status(204).json({
    status: 'success',
    product,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.slug) req.body.slug = req.params.slug;
  const updatedProduct = await Product.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    product: updatedProduct,
  });
});

exports.read = catchAsync(async (req, res, next) => {
  const product = await (await Product.findOne({ slug: req.params.slug }))
    .populate('category')
    .populate('subs')
    .execPopulate();
  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.listAll = catchAsync(async (req, res, next) => {
  const products = await Product.find({})
    .limit(parseInt(req.params.count))
    .sort([['createdAt', 'desc']]);
  res.status(200).json({
    status: 'success',
    products,
  });
});

// WITHOUT PAGINATION
// exports.list = catchAsync(async (req, res, next) => {
//   const { sort, order, limit } = req.body;
//   const products = await Product.find({})
//     .populate('category')
//     .populate('subs')
//     .sort([[sort, order]])
//     .limit(parseInt(limit))
//     .exec();
//   if (!products) return next(new AppError('No products found'));
//   res.status(200).json({
//     status: 'success',
//     products,
//   });
// });

exports.list = catchAsync(async (req, res, next) => {
  const { sort, order, page } = req.body;
  const currentPage = page || 1;
  const perPage = 6;

  const products = await Product.find({})
    .skip((currentPage - 1) * perPage)
    .populate('category')
    .populate('subs')
    .sort([[sort, order]])
    .limit(perPage)
    .exec();
  if (!products) return next(new AppError('No products found'));
  res.status(200).json({
    status: 'success',
    products,
  });
});

exports.productsCount = catchAsync(async (req, res, next) => {
  const total = await Product.find({}).estimatedDocumentCount();
  res.json({
    status: 'success',
    total,
  });
});
