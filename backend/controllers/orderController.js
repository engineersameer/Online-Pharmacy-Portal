const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Order = require('../models/Order');

// Ensure the uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'prescriptions');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // e.g., prescription-<timestamp>.<ext>
    const ext = path.extname(file.originalname);
    const filename = `prescription-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// File filter to accept only images and pdf
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, PDF are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// Controller: create a new order
const createOrder = async (req, res, next) => {
  try {
    // multer has processed file and appended to req.file
    const { receiverName, phone, address } = req.body;
    const userId = req.user.id; // Get from auth middleware

    // Validate required data
    if (!receiverName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'receiverName, phone, and address are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Prescription file is required'
      });
    }

    // Build order object
    const newOrder = new Order({
      receiverName,
      phone,
      address,
      filePath: `/uploads/prescriptions/${req.file.filename}`,
      status: 'pending',
      userId
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and is pending review',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
};

// Get all orders for a customer
const getCustomerOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify user is requesting their own orders
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders'
      });
    }

    const orders = await Order.find({ userId }).sort('-createdAt');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    next(error);
  }
};

// Update a pending order
const updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { receiverName, phone, address } = req.body;

    const order = await Order.findById(orderId);

    // Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own orders'
      });
    }

    // Check if order is pending
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be updated'
      });
    }

    // Update fields
    order.receiverName = receiverName || order.receiverName;
    order.phone = phone || order.phone;
    order.address = address || order.address;

    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    next(error);
  }
};

// Delete a pending order
const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    // Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own orders'
      });
    }

    // Check if order is pending
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be deleted'
      });
    }

    // Delete the prescription file
    const filePath = path.join(__dirname, '..', order.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    next(error);
  }
};

// Export all functions
module.exports = {
  upload,
  createOrder,
  getCustomerOrders,
  updateOrder,
  deleteOrder
}; 