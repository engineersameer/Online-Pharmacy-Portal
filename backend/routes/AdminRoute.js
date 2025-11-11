const express = require('express');
const router = express.Router();
const { adminHome, getAllOrders, updateOrderStatus, getAllUsers, deleteUser } = require('../controllers/AdminController');

// Example admin home route
router.get('/home', adminHome);

// Admin: Get all orders
router.get('/orders', getAllOrders);

// Admin: Update order status
router.put('/orders/:id/status', updateOrderStatus);

// Admin: Users management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;