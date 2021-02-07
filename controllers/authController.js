const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrUpdateUser = catchAsync(async (req, res) => {
  const { name, picture, email } = req.user;
  let user = await User.findOneAndUpdate(
    { email },
    { name, picture },
    { new: true }
  );
  if (!user) {
    user = await new User({
      email,
      name,
      picture,
    }).save();
  }
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.currentUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) return next(new AppError('User is not found', 401));
  res.status(200).json({
    status: 'success',
    user,
  });
});
