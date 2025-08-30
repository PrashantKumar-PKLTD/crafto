const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Generic SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
};

// Send email function
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'PianoLearn',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER
      },
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails (for newsletters)
const sendBulkEmail = async (recipients, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    const results = [];

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const promises = batch.map(async (recipient) => {
        try {
          const result = await transporter.sendMail({
            from: {
              name: process.env.FROM_NAME || 'PianoLearn',
              address: process.env.FROM_EMAIL || process.env.EMAIL_USER
            },
            to: recipient.email,
            subject: subject,
            html: htmlContent.replace('{{firstName}}', recipient.firstName || 'Piano Enthusiast')
          });
          
          return { email: recipient.email, success: true, messageId: result.messageId };
        } catch (error) {
          console.error(`Failed to send to ${recipient.email}:`, error);
          return { email: recipient.email, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📧 Bulk email completed: ${successful} sent, ${failed} failed`);
    
    return {
      success: true,
      total: recipients.length,
      successful,
      failed,
      results
    };

  } catch (error) {
    console.error('❌ Bulk email failed:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to PianoLearn, ${name}!</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <p>Thank you for joining our piano learning community!</p>
        <p>Get ready to embark on an amazing musical journey.</p>
      </div>
    </div>
  `,
  
  purchaseConfirmation: (name, product, downloadUrl) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Purchase Confirmed!</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <p>Thank you for purchasing <strong>${product}</strong>!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Download Your PDF
          </a>
        </div>
        <p>Your download link will be active for 30 days.</p>
      </div>
    </div>
  `,

  paymentOptions: (productTitle, productPrice, productId, email, productImage) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Complete Your Purchase</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
          Choose your preferred payment method below
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
          <p style="color: #667eea; margin: 0; font-size: 32px; font-weight: bold;">${productPrice}</p>
        </div>
      </div>
      
      <!-- Payment Methods -->
      <div style="padding: 40px 20px; background: white;">
        <h3 style="color: #333; margin-bottom: 30px; text-align: center; font-size: 24px;">Choose Payment Method</h3>
        
        <!-- Razorpay Payment Button -->
        <div style="margin-bottom: 20px;">
          <a href="${process.env.CORS_ORIGIN || 'http://localhost:5173'}?payment=razorpay&product=${productId}&email=${encodeURIComponent(email)}" 
             style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 25px; text-decoration: none; border-radius: 15px; 
                    text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 15px;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            💳 Pay with Razorpay
            <div style="font-size: 14px; opacity: 0.9; margin-top: 8px;">Credit/Debit Cards, UPI, Net Banking • Instant access</div>
          </a>
        </div>
        
        <!-- UPI Payment Button -->
        <div style="margin-bottom: 30px;">
          <a href="${process.env.CORS_ORIGIN || 'http://localhost:5173'}?payment=upi&product=${productId}&email=${encodeURIComponent(email)}" 
             style="display: block; background: linear-gradient(135deg, #00c851 0%, #007e33 100%); 
                    color: white; padding: 25px; text-decoration: none; border-radius: 15px; 
                    text-align: center; font-weight: bold; font-size: 18px;
                    box-shadow: 0 4px 15px rgba(0, 200, 81, 0.3);">
            📱 Pay with UPI
            <div style="font-size: 14px; opacity: 0.9; margin-top: 8px;">Google Pay, PhonePe, Paytm & more • Quick & secure</div>
          </a>
        </div>
        
        <!-- Direct UPI ID Payment -->
        <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 15px; border: 2px dashed #28a745;">
          <h4 style="color: #333; margin-bottom: 15px; text-align: center; font-size: 18px;">💰 Pay Directly via UPI</h4>
          <div style="text-align: center; margin-bottom: 15px;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 16px;">Send payment to UPI ID:</p>
            <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd; display: inline-block;">
              <span style="font-family: monospace; font-size: 18px; font-weight: bold; color: #28a745;">${process.env.UPI_ID || 'pianolearn@upi'}</span>
            </div>
          </div>
          <div style="text-align: center; margin-bottom: 15px;">
            <p style="color: #666; margin: 0 0 5px 0; font-size: 16px;">Amount: <strong style="color: #28a745; font-size: 20px;">₹${productPrice}</strong></p>
            <p style="color: #666; margin: 0; font-size: 14px;">Reference: ${productTitle.substring(0, 20)}...</p>
          </div>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 10px;">
            <p style="color: #2d5a2d; margin: 0; font-size: 14px; text-align: center;">
              📝 <strong>After payment:</strong> Send screenshot to <a href="mailto:support@pianolearn.com" style="color: #28a745;">support@pianolearn.com</a> with your email (${email}) to get instant download link
            </p>
          </div>
        </div>
        
        <!-- Features -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 15px; margin-bottom: 30px;">
          <h4 style="color: #333; margin-bottom: 20px; text-align: center; font-size: 20px;">🎹 What You Get:</h4>
          <div style="display: grid; gap: 12px;">
            <div style="display: flex; align-items: center; color: #2d5a2d;">
              <span style="margin-right: 12px; font-size: 18px;">✅</span>
              <span style="font-size: 16px;">Instant PDF download after payment</span>
            </div>
            <div style="display: flex; align-items: center; color: #2d5a2d;">
              <span style="margin-right: 12px; font-size: 18px;">✅</span>
              <span style="font-size: 16px;">High-quality piano learning materials</span>
            </div>
            <div style="display: flex; align-items: center; color: #2d5a2d;">
              <span style="margin-right: 12px; font-size: 18px;">✅</span>
              <span style="font-size: 16px;">Lifetime access to your purchase</span>
            </div>
            <div style="display: flex; align-items: center; color: #2d5a2d;">
              <span style="margin-right: 12px; font-size: 18px;">✅</span>
              <span style="font-size: 16px;">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
        
        <!-- Security Notice -->
        <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border-radius: 15px;">
          <p style="color: #2d5a2d; margin: 0; font-size: 16px; font-weight: 600;">
            🔒 Your payment is secured with 256-bit SSL encryption
          </p>
          <p style="color: #2d5a2d; margin: 8px 0 0 0; font-size: 14px;">
            Trusted by thousands of piano students worldwide
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
  `
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
};