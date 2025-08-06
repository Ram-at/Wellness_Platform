const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Each tag cannot exceed 20 characters']
  }],
  jsonFileUrl: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number, // in minutes
    min: [1, 'Duration must be at least 1 minute'],
    max: [300, 'Duration cannot exceed 300 minutes']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  category: {
    type: String,
    enum: ['yoga', 'meditation', 'breathing', 'stretching', 'mindfulness', 'other'],
    default: 'other'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date
  },
  lastSaved: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
sessionSchema.index({ author: 1, isPublished: 1 });
sessionSchema.index({ isPublished: 1, category: 1 });
sessionSchema.index({ tags: 1 });

// Method to publish session
sessionSchema.methods.publish = function() {
  this.isPublished = true;
  this.isDraft = false;
  this.publishedAt = new Date();
  return this.save();
};

// Method to save as draft
sessionSchema.methods.saveAsDraft = function() {
  this.isDraft = true;
  this.isPublished = false;
  this.lastSaved = new Date();
  return this.save();
};

// Method to increment views
sessionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Session', sessionSchema); 