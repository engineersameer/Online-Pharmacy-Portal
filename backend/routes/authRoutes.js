const express = require('express');
const router = express.Router();
const { signupCustomer, signinCustomer, getCustomerProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Test route
router.get('/test', (req, res) => {
  console.log('Auth test route hit');
  res.json({ message: 'Auth routes are working!' });
});

// Public routes
router.post('/signup', signupCustomer);
router.post('/signin', signinCustomer);

// Protected routes
router.get('/profile', protect, getCustomerProfile);

module.exports = router; 