const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');

// Get customer profile
const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Update customer profile
const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, phone, address, city, password } = req.body;
    const customerId = req.user.id;

    // Find customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if phone number is being changed and if it's already in use
    if (phone && phone !== customer.phone) {
      const phoneExists = await Customer.findOne({ phone, _id: { $ne: customerId } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already in use'
        });
      }
    }

    // Update fields
    customer.name = name || customer.name;
    customer.age = age || customer.age;
    customer.gender = gender || customer.gender;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.city = city || customer.city;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(password, salt);
    }

    // Save updates
    await customer.save();

    // Return updated customer without password
    const updatedCustomer = await Customer.findById(customerId).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
}; 