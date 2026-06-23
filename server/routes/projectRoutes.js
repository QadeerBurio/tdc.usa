const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Ensure uploads/projects directory exists
const uploadDir = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Get all active projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .sort({ completionDate: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true, isFeatured: true })
      .limit(3);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }

    if (typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    }
    if (projectData.isFeatured !== undefined) {
      projectData.isFeatured = projectData.isFeatured === 'true';
    }
    if (projectData.isActive !== undefined) {
      projectData.isActive = projectData.isActive === 'true';
    }
    if (projectData.completionDate === '') {
      projectData.completionDate = null;
    }

    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };

    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}`;
    }

    if (typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    }
    if (projectData.isFeatured !== undefined) {
      projectData.isFeatured = projectData.isFeatured === 'true';
    }
    if (projectData.isActive !== undefined) {
      projectData.isActive = projectData.isActive === 'true';
    }
    if (projectData.completionDate === '') {
      projectData.completionDate = null;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;