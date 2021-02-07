const admin = require('../firebase');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.authCheck = catchAsync(async (req, res, next) => {
  if (!req.headers.authtoken)
    return next(new AppError('You are not authenticated', 401));
  const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
  if (!firebaseUser) return next(new AppError('Invalid token or expired', 400));
  req.user = firebaseUser;
  next();
});

exports.adminCheck = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email, role: 'admin' });
  if (!adminUser)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  next();
});
