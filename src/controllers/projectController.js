const Project = require('../models/Project');
const { deleteCloudinaryAsset } = require('../config/cloudinary');

const getProjects = async (req, res, next) => {
  try {
    const {
      search,
      category,
      technology,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
      includeUnpublished = 'false',
    } = req.query;

    const query = {};

    if (includeUnpublished !== 'true') {
      query.published = true;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (technology && technology !== 'All') {
      query.technologies = { $in: [new RegExp(technology, 'i')] };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { problem: searchRegex },
        { solution: searchRegex },
        { tags: { $in: [searchRegex] } },
        { technologies: { $in: [searchRegex] } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'featured') sortOptions = { featured: -1, createdAt: -1 };
    if (sort === 'title') sortOptions = { title: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      projects,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let project = await Project.findOne({ slug });

    if (!project && slug.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(slug);
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, slug } = req.body;

    const projectSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingProject = await Project.findOne({ slug: projectSlug });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Project with this slug already exists',
      });
    }

    const projectData = {
      ...req.body,
      slug: projectSlug,
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (req.body.title && !req.body.slug) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.images && project.images.length > 0) {
      for (const img of project.images) {
        if (img.public_id) {
          await deleteCloudinaryAsset(img.public_id);
        }
      }
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
