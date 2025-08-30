const express = require('express');
const { Product } = require('../config/database');
const router = express.Router();

// Get all active products for public website
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' }).sort({ created_at: -1 }).lean();

    const mapped = products.map(p => ({
      id: String(p._id),
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: p.price,
      originalPrice: p.original_price || p.price,
      rating: p.rating || 0,
      pages: p.pages || 0,
      downloads: p.downloads || 0,
      badge: p.badge || 'New',
      badgeColor: p.badgeColor || 'bg-blue-500',
      image: p.image || '',

      // 👇 This is the important part
      preview: p.file_path ? p.file_path : null,
    }));

    res.json({ success: true, products: mapped });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// Get single product details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).select('-file_path');
    
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;