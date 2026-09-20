const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(contactLimiter, submitContactMessage)
  .get(protect, adminOnly, getContactMessages);

router.route('/:id/status')
  .patch(protect, adminOnly, updateMessageStatus);

router.route('/:id')
  .delete(protect, adminOnly, deleteContactMessage);

module.exports = router;
