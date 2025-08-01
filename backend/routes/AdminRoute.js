const express = require('express');
const router = express.Router();
const { adminHome } = require('../controllers/AdminController');

// Example admin home route
router.get('/home', adminHome);

module.exports = router;