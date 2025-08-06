const express = require('express');
const Session = require('../models/Session');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all public sessions
// GET /api/sessions
// Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const query = { isPublished: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Search by title or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const sessions = await Session.find(query)
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Session.countDocuments(query);
    
    res.json({
      success: true,
      data: sessions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + sessions.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions'
    });
  }
});

// Get user's sessions (drafts + published)
// GET /api/sessions/my-sessions
// Private
router.get('/my-sessions', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { author: req.user._id };
    
    // Filter by status
    if (status === 'published') {
      query.isPublished = true;
    } else if (status === 'draft') {
      query.isDraft = true;
    }
    
    const skip = (page - 1) * limit;
    
    const sessions = await Session.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Session.countDocuments(query);
    
    res.json({
      success: true,
      data: sessions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + sessions.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your sessions'
    });
  }
});

// @desc    Get single user session
// @route   GET /api/sessions/my-sessions/:id
// @access  Private
router.get('/my-sessions/:id', protect, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session'
    });
  }
});

// @desc    Save session draft
// @route   POST /api/sessions/my-sessions/save-draft
// @access  Private
router.post('/my-sessions/save-draft', protect, async (req, res) => {
  try {
    const { title, tags, jsonFileUrl, description, duration, difficulty, category, sessionId } = req.body;
    
    // Validate required fields
    if (!title || !jsonFileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and JSON file URL are required'
      });
    }
    
    let session;
    
    if (sessionId) {
      // Update existing session
      session = await Session.findOne({
        _id: sessionId,
        author: req.user._id
      });
      
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
      
      // Update fields
      session.title = title;
      session.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
      session.jsonFileUrl = jsonFileUrl;
      session.description = description || '';
      session.duration = duration || 30;
      session.difficulty = difficulty || 'beginner';
      session.category = category || 'other';
      session.isDraft = true;
      session.isPublished = false;
      session.lastSaved = new Date();
      
      await session.save();
    } else {
      // Create new session
      session = await Session.create({
        title,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        jsonFileUrl,
        description: description || '',
        duration: duration || 30,
        difficulty: difficulty || 'beginner',
        category: category || 'other',
        author: req.user._id,
        isDraft: true,
        isPublished: false
      });
    }
    
    res.json({
      success: true,
      message: 'Draft saved successfully',
      data: session
    });
  } catch (error) {
    console.error('Save draft error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error saving draft'
    });
  }
});

// @desc    Publish session
// @route   POST /api/sessions/my-sessions/publish
// @access  Private
router.post('/my-sessions/publish', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    const session = await Session.findOne({
      _id: sessionId,
      author: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Validate required fields before publishing
    if (!session.title || !session.jsonFileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and JSON file URL are required to publish'
      });
    }
    
    // Publish the session
    await session.publish();
    
    res.json({
      success: true,
      message: 'Session published successfully',
      data: session
    });
  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing session'
    });
  }
});

// @desc    Get single public session
// @route   GET /api/sessions/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      isPublished: true
    }).populate('author', 'username');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Increment views
    await session.incrementViews();
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get public session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session'
    });
  }
});

module.exports = router; 