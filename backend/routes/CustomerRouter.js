const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  upload,
  createOrder,
  getCustomerOrders,
  updateOrder,
  deleteOrder
} = require('../controllers/CustomerController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes are protected
router.use(verifyToken);

// --- Customer Profile Routes ---
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// --- Order Routes ---
// POST /api/customers/order - place a new order
router.post('/order', upload.single('prescription'), createOrder);
// GET /api/customers/order/customer/:userId - get all orders for a customer
router.get('/order/customer/:userId', getCustomerOrders);
// PUT /api/customers/order/:orderId - update a pending order
router.put('/order/:orderId', updateOrder);
// DELETE /api/customers/order/:orderId - delete a pending order
router.delete('/order/:orderId', deleteOrder);

module.exports = router;