const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
      index: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    features: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Available', 'Custom Built', 'Beta', 'In Development'],
      default: 'Available',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({
  title: 'text',
  shortDescription: 'text',
  description: 'text',
  tags: 'text',
  technologies: 'text'
});

module.exports = mongoose.model('Product', productSchema);
