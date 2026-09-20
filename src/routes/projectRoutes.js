const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, adminOnly, createProject);

router.route('/:slug')
  .get(getProjectBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateProject)
  .delete(protect, adminOnly, deleteProject);

module.exports = router;
