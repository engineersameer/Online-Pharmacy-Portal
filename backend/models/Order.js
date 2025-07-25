const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  receiverName: {
    type: String,
    required: [true, 'Receiver name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  filePath: {
    type: String,
    required: [true, 'Prescription file path is required']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 