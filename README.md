# Subscription Management System API

A robust and scalable REST API for managing user subscriptions with advanced security features and automated email notifications.

## 🚀 Features

- **User Management**: Complete CRUD operations for user accounts
- **Subscription Management**: Create, update, and manage user subscriptions
- **Security**: Advanced rate limiting and bot protection
- **Email Automation**: Automated subscription reminder emails
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Global error handling with detailed logging
- **Database**: MongoDB with Mongoose ODM for efficient data management

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Security**: Arcjet (Rate limiting & Bot protection)
- **Email Service**: Upstash (Email automation)
- **Validation**: Express-validator
- **Environment**: dotenv

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishalsharma123321/Subscription-Tracker-Application.git
   cd subscription-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/subscription-management
   
   # Arcjet Configuration
   ARCJET_KEY=your_arcjet_api_key
   
   # Upstash Configuration
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   
   # Email Configuration
   UPSTASH_EMAIL_API_KEY=your_upstash_email_api_key
   UPSTASH_EMAIL_USERNAME=your_email_username
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Subscriptions
- `GET /subscriptions` - Get all subscriptions
- `GET /subscriptions/:id` - Get subscription by ID
- `POST /subscriptions` - Create new subscription
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Cancel subscription

### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse with configurable limits
- **Bot Protection**: Arcjet integration for advanced bot detection
- **Input Validation**: Comprehensive validation for all API endpoints
- **Error Handling**: Secure error responses without sensitive data exposure

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  subscriptions: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription Model
```javascript
{
  userId: ObjectId,
  planName: String,
  status: String,
  startDate: Date,
  endDate: Date,
  amount: Number,
  reminderSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 📧 Email Automation

The system automatically sends subscription reminders using Upstash:
- Reminder emails 7 days before subscription expiry
- Renewal notifications
- Cancellation confirmations


## 📝 Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run the test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible database solution
- Arcjet for advanced security features
- Upstash for reliable email automation

## 📞 Support

If you have any questions or issues, please:
1. Check the [Issues](https://github.com/yourusername/subscription-management-api/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the maintainer at vishalsharma2212003@gmail.com

---

**Made with ❤️ by Vishal Sharma **
