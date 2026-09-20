const Category = require('../models/Category');

const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type) {
      query.type = { $in: [type, 'both'] };
    }

    const categories = await Category.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, icon, description, type } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await Category.create({ name, slug, icon, description, type });
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
