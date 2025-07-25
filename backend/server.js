require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend origin
  credentials: true
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enhanced request logging
app.use((req, res, next) => {
  // Log request details
  console.log('\n=== Incoming Request ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('======================\n');

  // Capture response data
  const oldSend = res.send;
  res.send = function (data) {
    console.log('\n=== Outgoing Response ===');
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', res.getHeaders());
    console.log('Body:', data);
    console.log('======================\n');
    oldSend.apply(res, arguments);
  };

  next();
});

// Logger for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/customers', customerRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n=== Error Occurred ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('===================\n');
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
});

// Connect to MongoDB
console.log('\nAttempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGO_URI ? '(URI is set)' : '(URI is missing!)');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    
    // Start server only after successful database connection
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`
=================================
🚀 Server is running
📡 Port: ${PORT}
🌍 Mode: ${process.env.NODE_ENV || 'development'}
💾 Database: Connected
🔑 JWT Secret: ${process.env.JWT_SECRET ? '(set)' : '(missing!)'}
=================================
      `);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
}); 