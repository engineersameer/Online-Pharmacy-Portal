const express = require('express');
const router = express.Router();
const { upload, createOrder, getCustomerOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/order - place a new order
router.post('/', verifyToken, upload.single('prescription'), createOrder);

// GET /api/order/customer/:userId - get all orders for a customer
router.get('/customer/:userId', verifyToken, getCustomerOrders);

// PUT /api/order/:orderId - update a pending order
router.put('/:orderId', verifyToken, updateOrder);

// DELETE /api/order/:orderId - delete a pending order
router.delete('/:orderId', verifyToken, deleteOrder);

module.exports = router; 