const slugify = require('slugify');
const mongoose = require('mongoose');

const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/productModel');

exports.create = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const category = await new Category({ name, slug: slugify(name) }).save();
  res.status(200).json({
    status: 'success',
    category,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    { name, slug: slugify(name) },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    category,
  });
});

exports.list = catchAsync(async (req, res, next) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    categories,
  });
});

exports.getSubs = catchAsync(async (req, res, next) => {
  const subs = await SubCategory.find({ parent: req.params._id });
  if (!subs) return next(new AppError('Invalid id', 400));
  res.status(200).json({
    status: 'success',
    subs,
  });
});

exports.read = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return next(new AppError('Invalid slug name'));
  const products = await Product.find({ category })
    .populate('category')
    .exec();
  res.status(200).json({
    status: 'success',
    category,
    products,
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
  if (!deleted) return next(new AppError('Invalid slug name'));
  res.status(204).json({
    status: 'success',
    category: deleted,
  });
});
