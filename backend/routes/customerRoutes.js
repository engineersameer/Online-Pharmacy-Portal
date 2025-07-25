const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/customerController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes are protected
router.use(verifyToken);

// Get profile
router.get('/profile', getProfile);

// Update profile
router.put('/profile', updateProfile);

module.exports = router; 