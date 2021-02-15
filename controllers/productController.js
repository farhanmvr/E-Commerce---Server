const slugify = require('slugify');
const Product = require('../models/productModel');
const User = require('../models/userModel');
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
  res.status(200).json({
    status: 'success',
    total,
  });
});

exports.listRelated = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).exec();
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(8)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();
  res.status(200).json({
    status: 'success',
    products: relatedProducts ? relatedProducts : {},
  });
});

exports.productStar = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  // who is updating
  // check if currently logged in user have already added rating
  const existingRatingObject = product.ratings.find(
    (el) => el.postedBy.toString() === user._id.toString()
  );

  if (!existingRatingObject) {
    // if user haven't left rating, push it
    const ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
  } else {
    // if user have already rated, update
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      {
        $set: { 'ratings.$.star': star },
      },
      { new: true }
    ).exec();
  }
  res.status(200).json({
    status: 'success',
  });
});

// SEARCH / FILTERS
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json({
    status: 'success',
    products,
  });
};

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json({
      products,
    });
  } catch (err) {
    throw err;
  }
};

const handleCategory = async (req, res, category) => {
  try {
    const products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json({
      status: 'success',
      products,
    });
  } catch (err) {
    throw err;
  }
};

exports.searchFilters = catchAsync(async (req, res, next) => {
  const { query, price, category } = req.body;

  if (query) {
    await handleQuery(req, res, query);
  }
  if (price) {
    await handlePrice(req, res, price);
  }
  if (category) {
    await handleCategory(req, res, category);
  }
});
