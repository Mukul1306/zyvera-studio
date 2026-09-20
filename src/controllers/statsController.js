const Product = require('../models/Product');
const Project = require('../models/Project');
const ContactMessage = require('../models/ContactMessage');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      featuredProducts,
      totalProjects,
      featuredProjects,
      totalQueries,
      unreadQueries,
      recentProducts,
      recentQueries,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ featured: true }),
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
      Product.find().sort({ createdAt: -1 }).limit(5).select('title price category featured images published createdAt'),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt relatedProductTitle'),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        featuredProducts,
        totalProjects,
        featuredProjects,
        totalQueries,
        unreadQueries,
      },
      recentProducts,
      recentQueries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
