const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    // Try to connect to MongoDB with fallback options
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pianolearn';
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000, // Quick timeout
      socketTimeoutMS: 45000,
    });



    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    


    
    // Initialize sample data if database is empty
    await initializeSampleData();
  } catch (error) {
    console.warn('⚠️  MongoDB not available, running without database');
    console.log('💡 To enable database features, start MongoDB and restart the server');
    console.log('   macOS: brew services start mongodb/brew/mongodb-community');
    console.log('   Windows: net start MongoDB');
    console.log('   Linux: sudo systemctl start mongod');
    console.log('   Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
  }
};

// Initialize sample data
const initializeSampleData = async () => {
  try {
    const productCount = await Product.countDocuments();
    
    // Don't create sample data - only show admin uploaded PDFs
    console.log(`📊 Database initialized. Found ${productCount} products uploaded by admin.`);
  } catch (error) {
    console.error('⚠️ Error initializing sample data:', error.message);
  }
};

// Manual migration function (can be called if needed)
const runMigration = async () => {
  console.log('🚀 Starting manual migration...');
  
  try {
    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Initialize sample data
    await initializeSampleData();
    
    console.log('🎉 Migration completed successfully!');
    console.log('📊 MongoDB is ready with sample data');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  },
  responded_at: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Purchase Schema
const purchaseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  product_title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    enum: ['stripe', 'paypal'],
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripe_payment_id: {
    type: String
  },
  razorpay_order_id: {
    type: String
  },
  razorpay_payment_id: {
    type: String
  },
  upi_transaction_id: {
    type: String
  },
  download_token: {
    type: String,
    unique: true,
    required: true
  },
  download_count: {
    type: Number,
    default: 0
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Newsletter Subscriber Schema
const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribed_at: {
    type: Date,
    default: Date.now
  },
  unsubscribed_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Product Schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  original_price: {
    type: Number
  },
  file_path: {
    type: String,
    required: true
  },
  preview_path: {
    type: String
  },
  pages: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create Models
const User = mongoose.model('User', userSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);
const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = {
  connectDB,
  runMigration,
  User,
  ContactMessage,
  Purchase,
  NewsletterSubscriber,
  Product
};