const ContactMessage = require('../models/ContactMessage');
const Product = require('../models/Product');
const { sendNotificationEmail } = require('../config/mailer');

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message, productId } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Subject, and Message are required fields.',
      });
    }

    let relatedProductTitle = '';
    let relatedProductObjId = null;

    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        relatedProductTitle = product.title;
        relatedProductObjId = product._id;
      }
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      subject,
      message,
      relatedProduct: relatedProductObjId,
      relatedProductTitle,
      status: 'new',
    });

    // Forward email notification asynchronously
    sendNotificationEmail({
      name,
      email,
      phone,
      company,
      subject,
      message,
      relatedProductTitle,
    }).catch((err) => console.error('Email notification background error:', err));

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully received. We will get back to you shortly!',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
        { company: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      ContactMessage.countDocuments(query),
      ContactMessage.countDocuments({ status: 'new' }),
    ]);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      unreadCount,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      messages,
    });
  } catch (error) {
    next(error);
  }
};

const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'in_progress', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage,
};
