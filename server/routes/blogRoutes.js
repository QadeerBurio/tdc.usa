const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// Ensure uploads/blogs directory exists
const uploadDir = path.join(__dirname, '../uploads/blogs');
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
    cb(null, uniqueSuffix + path.extname(file.originalname));
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

// Get all blogs (supports authorization check for admin draft access)
router.get('/', async (req, res) => {
  try {
    let showAll = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        showAll = true;
      } catch (err) {
        // Token invalid, treat as public
      }
    }

    const filter = showAll ? {} : { status: 'Published' };

    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const blogs = await Blog.find(filter)
      .sort({ publishedDate: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let blog;
    
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      blog = await Blog.findById(idOrSlug);
    }
    
    if (!blog) {
      blog = await Blog.findOne({ slug: idOrSlug });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get related blogs
router.get('/:idOrSlug/related', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let blog;
    
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      blog = await Blog.findById(idOrSlug);
    }
    
    if (!blog) {
      blog = await Blog.findOne({ slug: idOrSlug });
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const related = await Blog.find({
      status: 'Published',
      category: blog.category,
      _id: { $ne: blog._id }
    })
    .sort({ publishedDate: -1 })
    .limit(3);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const blogData = { ...req.body };
    
    if (req.file) {
      blogData.featuredImage = `/uploads/blogs/${req.file.filename}`;
      blogData.image = `/uploads/blogs/${req.file.filename}`;
    } else {
      if (blogData.image && !blogData.featuredImage) {
        blogData.featuredImage = blogData.image;
      } else if (blogData.featuredImage && !blogData.image) {
        blogData.image = blogData.featuredImage;
      }
    }

    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // Typecast boolean/fields
    if (blogData.featured !== undefined) {
      blogData.featured = blogData.featured === 'true' || blogData.featured === true;
    }
    
    // Sync status and isPublished
    if (blogData.status) {
      blogData.isPublished = blogData.status === 'Published';
    } else if (blogData.isPublished !== undefined) {
      const isPub = blogData.isPublished === 'true' || blogData.isPublished === true;
      blogData.status = isPub ? 'Published' : 'Draft';
      blogData.isPublished = isPub;
    }

    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const blogData = { ...req.body };

    if (req.file) {
      blogData.featuredImage = `/uploads/blogs/${req.file.filename}`;
      blogData.image = `/uploads/blogs/${req.file.filename}`;
    } else {
      if (blogData.image !== undefined) {
        blogData.featuredImage = blogData.image;
      }
    }

    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Typecast boolean/fields
    if (blogData.featured !== undefined) {
      blogData.featured = blogData.featured === 'true' || blogData.featured === true;
    }

    // Sync status and isPublished
    if (blogData.status) {
      blogData.isPublished = blogData.status === 'Published';
    } else if (blogData.isPublished !== undefined) {
      const isPub = blogData.isPublished === 'true' || blogData.isPublished === true;
      blogData.status = isPub ? 'Published' : 'Draft';
      blogData.isPublished = isPub;
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogData,
      { new: true, runValidators: true }
    );
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;