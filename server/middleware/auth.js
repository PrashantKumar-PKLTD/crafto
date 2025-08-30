const jwt = require('jsonwebtoken');
const { User } = require('../config/database');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Verify user exists in database
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password_hash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user.profile = user;
    next();
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
};

// Admin only middleware
const requireAdmin = (req, res, next) => {
  // Check if user has admin role
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@pianolearn.com').split(',');
  
  if (!adminEmails.includes(req.user.email) && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = {
  verifyToken,
  verifyUser,
  requireAdmin,
  optionalAuth
};