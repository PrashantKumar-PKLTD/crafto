const express = require('express');
const { body, validationResult } = require('express-validator');
const { ContactMessage } = require('../config/database');
const { sendEmail } = require('../services/emailService');
const router = express.Router();

// Contact form submission
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Save to database
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });

    const savedMessage = await contactMessage.save();

    // Send confirmation email to user
    const userEmailContent = `
      <h2>Thank you for contacting PianoLearn!</h2>
      <p>Hi ${name},</p>
      <p>We've received your message and will get back to you within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p>${message}</p>
      <br>
      <p>Best regards,<br>The PianoLearn Team</p>
    `;

    // Send notification email to admin
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Send emails (don't wait for them to complete)
    sendEmail(email, 'Thank you for contacting PianoLearn', userEmailContent);
    sendEmail(process.env.ADMIN_EMAIL, `New Contact: ${subject}`, adminEmailContent);

    res.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      id: savedMessage._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ created_at: -1 });

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

module.exports = router;