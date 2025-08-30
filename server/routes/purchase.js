const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const QRCode = require('qrcode');
const { Purchase, Product } = require('../config/database');
const { sendEmail } = require('../services/emailService');
const router = express.Router();

// Initialize Razorpay
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Send payment email to user
router.post('/send-payment-email', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('productTitle').notEmpty().withMessage('Product title is required'),
  body('productPrice').notEmpty().withMessage('Product price is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, productId, productTitle, productPrice, productImage } = req.body;

    // Generate UPI QR code for email
    const upiString = `upi://pay?pa=${process.env.UPI_ID || 'pianolearn@upi'}&pn=${encodeURIComponent(process.env.UPI_MERCHANT_NAME || 'PianoLearn')}&am=${productPrice}&cu=INR&tn=${encodeURIComponent(`Payment for ${productTitle}`)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(upiString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Create payment email content
    const paymentEmailContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00c851 0%, #007e33 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎹 Complete Your Purchase</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
            Scan the QR code below to pay with UPI
          </p>
        </div>
        
        <!-- Product Info -->
        <div style="padding: 30px 20px; background: white; border-bottom: 1px solid #e9ecef;">
          <div style="text-align: center;">
            <img src="${productImage || 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=200'}" 
                 style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;" 
                 alt="${productTitle}">
            <h2 style="color: #333; margin: 0 0 8px 0; font-size: 24px;">${productTitle}</h2>
            <p style="color: #666; margin: 0 0 8px 0; font-size: 16px;">Digital PDF Download</p>
            <p style="color: #00c851; margin: 0; font-size: 32px; font-weight: bold;">₹${productPrice}</p>
          </div>
        </div>
        
        <!-- QR Code Payment Section -->
        <div style="padding: 40px 20px; background: white; text-align: center;">
          <h3 style="color: #333; margin-bottom: 25px; font-size: 24px;">📱 Scan QR Code to Pay</h3>
          
          <!-- QR Code -->
          <div style="margin-bottom: 30px;">
            <div style="display: inline-block; padding: 20px; background: white; border: 3px solid #00c851; border-radius: 20px; box-shadow: 0 8px 25px rgba(0, 200, 81, 0.2);">
              <img src="${qrCodeDataUrl}" 
                   alt="UPI Payment QR Code" 
                   style="width: 250px; height: 250px; display: block;">
            </div>
            <p style="color: #00c851; margin: 15px 0 0 0; font-size: 18px; font-weight: bold;">
              Amount: ₹${productPrice}
            </p>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">
              Reference: ${productTitle.substring(0, 25)}...
            </p>
          </div>
          
          <!-- UPI Apps -->
          <div style="margin-bottom: 30px;">
            <p style="color: #666; margin-bottom: 15px; font-size: 16px;">
              Open any UPI app and scan the QR code above:
            </p>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
              <span style="background: #4285f4; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">Google Pay</span>
              <span style="background: #5f259f; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">PhonePe</span>
              <span style="background: #00baf2; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">Paytm</span>
              <span style="background: #ff6b35; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">BHIM</span>
            </div>
          </div>
          
          <!-- Alternative UPI ID -->
          <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 12px; border: 2px dashed #28a745;">
            <h4 style="color: #333; margin-bottom: 15px;">💰 Or Pay via UPI ID</h4>
            <div style="text-align: center; margin-bottom: 15px;">
              <p style="color: #666; margin: 0 0 10px 0;">Send ₹${productPrice} to UPI ID:</p>
              <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd; display: inline-block;">
                <span style="font-family: monospace; font-size: 18px; font-weight: bold; color: #28a745;">${process.env.UPI_ID || 'pianolearn@upi'}</span>
              </div>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px;">
              <p style="color: #2d5a2d; margin: 0; font-size: 13px;">
                📝 <strong>After payment:</strong> Send payment screenshot to support@pianolearn.com with your email (${email}) to get instant download link
              </p>
            </div>
          </div>
          
          <!-- Features -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 15px; margin-bottom: 30px;">
            <h4 style="color: #333; margin-bottom: 20px; font-size: 20px;">🎹 What You Get:</h4>
            <div style="text-align: left; max-width: 400px; margin: 0 auto;">
              <div style="display: flex; align-items: center; margin-bottom: 12px; color: #2d5a2d;">
                <span style="margin-right: 12px; font-size: 18px;">✅</span>
                <span style="font-size: 16px;">Instant PDF download after payment</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 12px; color: #2d5a2d;">
                <span style="margin-right: 12px; font-size: 18px;">✅</span>
                <span style="font-size: 16px;">High-quality piano learning materials</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 12px; color: #2d5a2d;">
                <span style="margin-right: 12px; font-size: 18px;">✅</span>
                <span style="font-size: 16px;">Lifetime access to your purchase</span>
              </div>
              <div style="display: flex; align-items: center; color: #2d5a2d;">
                <span style="margin-right: 12px; font-size: 18px;">✅</span>
                <span style="font-size: 16px;">30-day money-back guarantee</span>
              </div>
            </div>
          </div>
          
          <!-- Payment Verification -->
          <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 15px; border: 2px solid #ffc107;">
            <h4 style="color: #856404; margin-bottom: 20px; text-align: center; font-size: 20px;">⚡ Get Instant Access</h4>
            <div style="text-align: center;">
              <p style="color: #856404; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                After completing UPI payment, click the button below:
              </p>
              <a href="${process.env.CORS_ORIGIN || 'http://localhost:5173'}/verify-payment?token=${downloadToken}&email=${encodeURIComponent(email)}" 
                 style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 12px; font-weight: bold; font-size: 16px;
                        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
                ✅ I've Completed Payment - Get Download Link
              </a>
              <p style="color: #856404; margin: 15px 0 0 0; font-size: 14px;">
                This will verify your payment and send you the download link instantly
              </p>
            </div>
          </div>
          
          <!-- Security Notice -->
          <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 15px;">
            <p style="color: #2d5a2d; margin: 0; font-size: 16px; font-weight: 600;">
              🔒 Your payment is secured with UPI's bank-grade security
            </p>
            <p style="color: #2d5a2d; margin: 8px 0 0 0; font-size: 14px;">
              Trusted by millions of users across India
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 30px 20px; background: #333; text-align: center;">
          <p style="color: #ccc; margin: 0; font-size: 16px; font-weight: 600;">
            Need help? Contact us at support@pianolearn.com
          </p>
          <p style="color: #999; margin: 15px 0 0 0; font-size: 14px;">
            This email was sent because you requested payment options for ${productTitle}
          </p>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">
            PianoLearn • Making piano learning accessible to everyone
          </p>
        </div>
      </div>
    `;

    // Send payment options email
    const emailResult = await sendEmail(
      email,
      `Complete Your Purchase: ${productTitle}`,
      paymentEmailContent
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Payment options sent to your email successfully!'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email'
      });
    }

  } catch (error) {
    console.error('Send payment email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create purchase intent
router.post('/create-intent', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('paymentMethod').isIn(['razorpay', 'upi']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, productId, paymentMethod } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let razorpayOrder = null;
    let upiQRCode = null;
    
    if (paymentMethod === 'razorpay') {
      if (razorpay) {
        // Create Razorpay order
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(product.price * 100), // Price is already in rupees, convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            productId: product._id.toString(),
            productTitle: product.title,
            customerEmail: email
          }
        });
      }
    } else if (paymentMethod === 'upi') {
      // Generate UPI payment string
      const upiString = `upi://pay?pa=${process.env.UPI_ID || 'merchant@upi'}&pn=${encodeURIComponent(process.env.UPI_MERCHANT_NAME || 'PianoLearn')}&am=${product.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${product.title}`)}`;
      
      // Generate QR code
      upiQRCode = await QRCode.toDataURL(upiString);
    }

    // Generate download token
    const downloadToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    // Save purchase record
    const purchase = new Purchase({
      email,
      product_id: product._id,
      product_title: product.title,
      price: product.price,
      payment_method: paymentMethod,
      download_token: downloadToken,
      expires_at: expiresAt,
      stripe_payment_id: paymentIntent?.id || null,
      razorpay_order_id: razorpayOrder?.id || null
    });

    const savedPurchase = await purchase.save();

    res.json({
      success: true,
      purchaseId: savedPurchase._id,
      razorpayOrderId: razorpayOrder?.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      upiQRCode: upiQRCode,
      upiString: paymentMethod === 'upi' ? `upi://pay?pa=${process.env.UPI_ID || 'merchant@upi'}&pn=${encodeURIComponent(process.env.UPI_MERCHANT_NAME || 'PianoLearn')}&am=${product.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${product.title}`)}` : null,
      downloadToken,
      product: {
        id: product._id,
        title: product.title,
        price: product.price
      }
    });

  } catch (error) {
    console.error('Purchase intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Confirm purchase and send download link
router.post('/confirm', [
  body('purchaseId').isMongoId().withMessage('Invalid purchase ID'),
  body('razorpayPaymentId').optional(),
  body('razorpaySignature').optional(),
  body('upiTransactionId').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { purchaseId, razorpayPaymentId, razorpaySignature, upiTransactionId } = req.body;

    // Find the purchase first
    const purchase = await Purchase.findById(purchaseId).populate('product_id');
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Verify payment based on method
    let isPaymentValid = false;
    let updateData = { payment_status: 'completed' };

    if (purchase.payment_method === 'razorpay' && razorpayPaymentId) {
      // Verify Razorpay signature
      if (razorpay && razorpaySignature) {
        const crypto = require('crypto');
        const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${purchase.razorpay_order_id}|${razorpayPaymentId}`)
          .digest('hex');
        
        if (expectedSignature === razorpaySignature) {
          updateData.razorpay_payment_id = razorpayPaymentId;
          isPaymentValid = true;
        }
      } else {
        // For demo purposes, accept without signature verification
        updateData.razorpay_payment_id = razorpayPaymentId;
        isPaymentValid = true;
      }
    } else if (purchase.payment_method === 'upi' && upiTransactionId) {
      updateData.upi_transaction_id = upiTransactionId;
      isPaymentValid = true;
    }

    if (!isPaymentValid) {
      return res.status(404).json({
        success: false,
        message: 'Invalid payment verification'
      });
    }

    // Update purchase status
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      purchaseId,
      updateData,
      { new: true }
    ).populate('product_id');

    // Send download email
    const downloadUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/api/purchase/download/${updatedPurchase.download_token}`;
    
    const emailContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Payment Successful!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
            Your PDF is ready for download
          </p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">📋 Purchase Details:</h3>
            <p style="margin: 8px 0;"><strong>Product:</strong> ${updatedPurchase.product_title}</p>
            <p style="margin: 8px 0;"><strong>Price:</strong> ₹${updatedPurchase.price}</p>
            <p style="margin: 8px 0;"><strong>Payment Method:</strong> UPI</p>
            <p style="margin: 8px 0;"><strong>Purchase Date:</strong> ${new Date(updatedPurchase.created_at).toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                      color: white; padding: 20px 40px; text-decoration: none; 
                      border-radius: 12px; font-weight: bold; font-size: 18px;
                      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
              📥 Download Your PDF Now
            </a>
            <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">
              Or copy this link: <br>
              <span style="background: #f8f9fa; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 12px; word-break: break-all;">${downloadUrl}</span>
            </p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h4 style="color: #2d5a2d; margin-bottom: 15px;">📌 Important Notes:</h4>
            <ul style="color: #2d5a2d; margin: 0; padding-left: 20px;">
              <li>This download link will expire in 30 days</li>
              <li>You can download the PDF multiple times within the validity period</li>
              <li>Save the PDF to your device for offline access</li>
              <li>Contact support if you face any issues downloading</li>
            </ul>
          </div>
          
          <p style="color: #666; text-align: center; margin-top: 30px;">
            Thank you for choosing PianoLearn! 🎹<br>
            Happy learning!
          </p>
        </div>
        
        <div style="padding: 20px; background: #333; text-align: center;">
          <p style="color: #ccc; margin: 0; font-size: 14px;">
            Need help? Contact us at support@pianolearn.com
          </p>
        </div>
      </div>
    `;

    sendEmail(
      updatedPurchase.email,
      `🎹 Your PianoLearn Purchase: ${updatedPurchase.product_title}`,
      emailContent
    );

    // Update product download count
    await Product.findByIdAndUpdate(
      updatedPurchase.product_id,
      { $inc: { downloads: 1 } }
    );

    res.json({
      success: true,
      message: 'Purchase confirmed! Check your email for the download link.',
      downloadToken: updatedPurchase.download_token,
      downloadUrl: downloadUrl
    });

  } catch (error) {
    console.error('Purchase confirm error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get purchase history for user
router.get('/history/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const purchases = await Purchase.find({
      email,
      payment_status: 'completed'
    })
    .populate('product_id', 'title subtitle pages')
    .sort({ created_at: -1 });

    res.json({
      success: true,
      purchases
    });

  } catch (error) {
    console.error('Purchase history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Download PDF endpoint
router.get('/download/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find purchase by download token
    const purchase = await Purchase.findOne({
      download_token: token,
      payment_status: 'completed'
    }).populate('product_id');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Download link not found or expired'
      });
    }

    // Check if download link has expired
    if (new Date() > purchase.expires_at) {
      return res.status(410).json({
        success: false,
        message: 'Download link has expired'
      });
    }

    // Get the PDF file path
    const filePath = path.join(__dirname, '..', purchase.product_id.file_path);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    // Increment download count
    await Purchase.findByIdAndUpdate(
      purchase._id,
      { $inc: { download_count: 1 } }
    );

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${purchase.product_title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;