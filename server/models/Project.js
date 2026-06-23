const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  technologies: [String],
  client: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    default: 'Technology',
  },
  challenge: {
    type: String,
    default: '',
  },
  solution: {
    type: String,
    default: '',
  },
  results: {
    type: String,
    default: '',
  },
  completionDate: {
    type: Date,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);