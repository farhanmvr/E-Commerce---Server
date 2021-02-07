const slugify = require('slugify');

const SubCategory = require('../models/subCategoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.create = catchAsync(async (req, res, next) => {
  const { name, parent } = req.body;
  const subCategory = await new SubCategory({
    name,
    parent,
    slug: slugify(name),
  }).save();
  res.status(200).json({
    status: 'success',
    subCategory,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { name, parent } = req.body;
  if (!name || !parent)
    return next(new AppError('Name and parent are required', 400));
  const subCategory = await SubCategory.findOneAndUpdate(
    { slug: req.params.slug },
    { name, slug: slugify(name), parent },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    subCategory,
  });
});

exports.list = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    subCategories,
  });
});

exports.read = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findOne({ slug: req.params.slug });
  if (!subCategory) return next(new AppError('Invalid slug name'));
  res.status(200).json({
    status: 'success',
    subCategory,
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const deleted = await SubCategory.findOneAndDelete({ slug: req.params.slug });
  if (!deleted) return next(new AppError('Invalid slug name'));
  res.status(204).json({
    status: 'success',
    subCategory: deleted,
  });
});
