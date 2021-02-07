const cloudinary = require('cloudinary');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SCRET,
});

exports.upload = catchAsync(async (req, res, next) => {
  console.log('evde ethi');
  if (!req.body.image) return next(new AppError('Image file required'));
  const result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto',
  });
  res.status(200).json({
    status: 'success',
    public_id: result.public_id,
    url: result.secure_url,
  });
});

exports.remove = catchAsync(async (req, res, next) => {
  const image_id = req.body.public_id;
  const result = await cloudinary.uploader.destroy(image_id);
  res.status(204).json({
    status: 'success',
    result,
  });
});
