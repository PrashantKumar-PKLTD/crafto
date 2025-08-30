# PianoLearn Backend API

A complete Node.js/Express backend for the Piano Learning Website with SQLite database, email services, and payment processing.

## Features

- **User Authentication**: JWT-based auth with registration/login
- **Contact Management**: Store and manage contact form submissions
- **Purchase System**: Complete e-commerce flow with Stripe/PayPal
- **Newsletter**: Email subscription management
- **Email Service**: Automated emails with multiple provider support
- **Database**: SQLite with proper schema and migrations
- **Security**: Rate limiting, input validation, password hashing
- **File Management**: PDF storage and download system

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

### 3. Database Setup
```bash
# Create database and sample data
npm run migrate
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin only)

### Purchases
- `POST /api/purchase/create-intent` - Create purchase intent
- `POST /api/purchase/confirm` - Confirm payment
- `GET /api/purchase/history/:email` - Get purchase history

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `GET /api/newsletter/stats` - Get subscription stats

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

### Required
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_here
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
```

### Optional
```env
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_paypal_id
AWS_ACCESS_KEY_ID=your_aws_key
# See .env.example for complete list
```

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in `EMAIL_APP_PASSWORD`

### SendGrid Setup
1. Create SendGrid account
2. Generate API key
3. Set `EMAIL_SERVICE=sendgrid`
4. Set `SENDGRID_API_KEY`

### Custom SMTP
1. Set `EMAIL_SERVICE=smtp`
2. Configure SMTP settings in .env

## Payment Integration

### Stripe
1. Create Stripe account
2. Get API keys from dashboard
3. Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
4. Configure webhook endpoint for production

### PayPal
1. Create PayPal developer account
2. Create application
3. Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`

## Database Schema

### Users
- id, email, password_hash, first_name, last_name
- created_at, updated_at

### Contact Messages
- id, name, email, subject, message, status
- created_at, responded_at

### Purchases
- id, email, product_id, price, payment_method
- payment_status, download_token, expires_at

### Newsletter Subscribers
- id, email, status, subscribed_at, unsubscribed_at

### Products
- id, title, subtitle, description, price
- file_path, pages, downloads, rating

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated and sanitized
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure authentication with 7-day expiry
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers middleware

## File Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── contact.js           # Contact form routes
│   ├── newsletter.js        # Newsletter routes
│   └── purchase.js          # Purchase routes
├── services/
│   └── emailService.js      # Email service
├── scripts/
│   └── migrate.js           # Database migration
├── database/
│   └── pianolearn.db        # SQLite database
├── .env.example             # Environment template
├── package.json
└── server.js                # Main server file
```

## Development

### Adding New Routes
1. Create route file in `/routes`
2. Add validation middleware
3. Import and use in `server.js`

### Database Changes
1. Update schema in `config/database.js`
2. Add migration in `scripts/migrate.js`
3. Run `npm run migrate`

### Email Templates
1. Add template to `services/emailService.js`
2. Use in route handlers

## Production Deployment

### Environment
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure production email service
- Set up proper CORS origins

### Database
- Consider PostgreSQL for production
- Set up regular backups
- Monitor performance

### Security
- Use HTTPS
- Set up proper firewall rules
- Monitor for suspicious activity
- Regular security updates

## Monitoring

### Health Checks
- `/api/health` endpoint for monitoring
- Database connection status
- Email service status

### Logging
- Console logging in development
- File logging in production
- Error tracking service integration

## Support

For issues and questions:
- Check the logs in console
- Verify environment variables
- Test API endpoints with Postman
- Check database connections

## License

MIT License - see LICENSE file for details