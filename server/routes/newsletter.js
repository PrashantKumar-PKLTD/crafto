const express = require('express');
const { body, validationResult } = require('express-validator');
const { NewsletterSubscriber } = require('../config/database');
const { sendEmail } = require('../services/emailService');
const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email });

    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        existing.status = 'active';
        existing.subscribed_at = new Date();
        existing.unsubscribed_at = null;
        await existing.save();

        // Send welcome email
        sendWelcomeEmail(email);

        return res.json({
          success: true,
          message: 'Successfully resubscribed to newsletter!'
        });
      }
    } else {
      // New subscription
      const subscriber = new NewsletterSubscriber({
        email,
        status: 'active'
      });

      const savedSubscriber = await subscriber.save();

      // Send welcome email
      sendWelcomeEmail(email);

      res.json({
        success: true,
        message: 'Successfully subscribed to newsletter!',
        id: savedSubscriber._id
      });
    }

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email, status: 'active' },
      { 
        status: 'unsubscribed', 
        unsubscribed_at: new Date() 
      },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in active subscriptions'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get newsletter statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    const activeSubscribers = await NewsletterSubscriber.countDocuments({ status: 'active' });
    const unsubscribedCount = await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySubscriptions = await NewsletterSubscriber.countDocuments({
      subscribed_at: { $gte: today }
    });

    const stats = {
      total_subscribers: totalSubscribers,
      active_subscribers: activeSubscribers,
      unsubscribed_count: unsubscribedCount,
      today_subscriptions: todaySubscriptions
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to send welcome email
function sendWelcomeEmail(email) {
  const welcomeContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PianoLearn!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
          Thank you for subscribing to our newsletter
        </p>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">What to expect:</h2>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #667eea; margin-bottom: 10px;">🎹 Weekly Piano Tips</h3>
          <p style="color: #666; line-height: 1.6;">
            Get expert piano techniques and practice tips delivered to your inbox every week.
          </p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #667eea; margin-bottom: 10px;">📚 Free Resources</h3>
          <p style="color: #666; line-height: 1.6;">
            Access to exclusive sheet music, chord charts, and practice exercises.
          </p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #667eea; margin-bottom: 10px;">🎵 New Course Updates</h3>
          <p style="color: #666; line-height: 1.6;">
            Be the first to know about new piano courses and special discounts.
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 15px 30px; text-decoration: none; 
                    border-radius: 8px; font-weight: bold; display: inline-block;">
            Start Learning Piano
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 40px;">
          You can unsubscribe at any time by clicking the unsubscribe link in our emails.
        </p>
      </div>
    </div>
  `;

  sendEmail(email, 'Welcome to PianoLearn Newsletter! 🎹', welcomeContent);
}

module.exports = router;