const express = require('express');
const router = express.Router();
const { adminHome, getAllOrders, updateOrderStatus } = require('../controllers/AdminController');

// Example admin home route
router.get('/home', adminHome);

// Admin: Get all orders
router.get('/orders', getAllOrders);

// Admin: Update order status
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;