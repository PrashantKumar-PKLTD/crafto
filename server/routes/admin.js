const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { Product, User, ContactMessage, Purchase, NewsletterSubscriber } = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/pdfs');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Admin login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists and is admin
    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@pianolearn.com').split(',');
    
    if (!adminEmails.includes(email)) {
      return res.status(401).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // For demo purposes, use a simple password check
    // In production, you should hash passwords and store admin users in database
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: 'admin', 
        email: email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        email: email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get admin dashboard stats
router.get('/dashboard', verifyToken, requireAdmin, async (req, res) => {
  try {
    const stats = {
      totalProducts: await Product.countDocuments(),
      totalPurchases: await Purchase.countDocuments({ payment_status: 'completed' }),
      totalRevenue: await Purchase.aggregate([
        { $match: { payment_status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),
      totalSubscribers: await NewsletterSubscriber.countDocuments({ status: 'active' }),
      totalMessages: await ContactMessage.countDocuments(),
      recentPurchases: await Purchase.find({ payment_status: 'completed' })
        .sort({ created_at: -1 })
        .limit(5)
        .populate('product_id', 'title'),
      recentMessages: await ContactMessage.find()
        .sort({ created_at: -1 })
        .limit(5)
    };

    res.json({
      success: true,
      stats: {
        ...stats,
        totalRevenue: stats.totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all products
router.get('/products', verifyToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: -1 });
    
    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload new PDF product
router.post('/products', verifyToken, requireAdmin, upload.single('pdf'), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('subtitle').optional().trim(),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('pages').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('Pages must be a positive integer')
], async (req, res) => {
  try {
    console.log('📝 Upload request received:', {
      body: req.body,
      file: req.file ? { filename: req.file.filename, size: req.file.size } : 'No file',
      headers: req.headers['content-type']
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      // Delete uploaded file if validation fails
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: 'Validation failed: ' + errors.array().map(e => e.msg).join(', ')
      });
    }

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    const { title, subtitle, description, price, originalPrice, pages } = req.body;

    console.log('📊 Processing data:', { title, subtitle, description, price, originalPrice, pages });

    // Handle empty string values
    const processedOriginalPrice = (originalPrice && originalPrice !== '' && originalPrice !== 'undefined') 
      ? parseFloat(originalPrice) 
      : parseFloat(price) * 1.5;
    const processedPages = (pages && pages !== '' && pages !== 'undefined') 
      ? parseInt(pages) 
      : 0;

    console.log('🔄 Processed values:', { 
      price: parseFloat(price), 
      processedOriginalPrice, 
      processedPages 
    });
    // Create product record
    const product = new Product({
      title,
      subtitle: subtitle || '',
      description,
      price: parseFloat(price),
      original_price: processedOriginalPrice,
      file_path: `/uploads/pdfs/${req.file.filename}`,
      pages: processedPages,
      downloads: 0,
      rating: 0,
      status: 'active'
    });

    const savedProduct = await product.save();

    console.log('✅ Product saved successfully:', savedProduct._id);

    res.json({
      success: true,
      message: 'PDF product uploaded successfully',
      product: savedProduct
    });

  } catch (error) {
    console.error('💥 Upload error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file
    });
    
    // Delete uploaded file if database save fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Update product
router.put('/products/:id', verifyToken, requireAdmin, [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('subtitle').optional().trim(),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('pages').optional().isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
  body('status').optional().isIn(['active', 'inactive', 'draft']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Convert string numbers to actual numbers
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.original_price = parseFloat(updateData.originalPrice);
    if (updateData.pages) updateData.pages = parseInt(updateData.pages);

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete product
router.delete('/products/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete the PDF file
    const filePath = path.join(__dirname, '..', product.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all contact messages
router.get('/messages', verifyToken, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ created_at: -1 });
    
    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark message as read
router.put('/messages/:id/read', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message
    });

  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all purchases
router.get('/purchases', verifyToken, requireAdmin, async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('product_id', 'title subtitle')
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      purchases
    });

  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get newsletter subscribers
router.get('/subscribers', verifyToken, requireAdmin, async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ subscribed_at: -1 });
    
    res.json({
      success: true,
      subscribers
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;