const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
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
    problem: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    challenges: {
      type: String,
      default: '',
    },
    results: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    demoUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
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

projectSchema.index({
  title: 'text',
  shortDescription: 'text',
  description: 'text',
  tags: 'text',
  technologies: 'text'
});

module.exports = mongoose.model('Project', projectSchema);
