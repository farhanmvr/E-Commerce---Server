const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      text: true,
      required: [true, 'Product must have a title'],
      minlength: [2, 'Name is too short'],
      maxlength: [32, 'Name is too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
      required: [true, 'Product must have a slug'],
    },
    description: {
      type: String,
      trim: true,
      text: true,
      required: [true, 'Product must have a description'],
      minlength: [5, 'Descrioption is too short'],
      maxlength: [2000, 'Descrioption is too long'],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, 'Product must have a title'],
      minlength: [2, 'Name is too short'],
      maxlength: [32, 'Name is too long'],
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    subs: [
      {
        type: ObjectId,
        ref: 'SubCategory',
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ['Yes', 'No'],
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    },
    brand: {
      type: String,
      enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus'],
    },
    ratings: [
      {
        star: Number,
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
