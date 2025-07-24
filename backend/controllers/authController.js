const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new customer
// @route   POST /api/auth/signup
// @access  Public
exports.signupCustomer = async (req, res) => {
  try {
    console.log('\n=== Processing Signup Request ===');
    console.log('Request Body:', req.body);

    const { name, age, gender, phone, address, city, password } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'age', 'gender', 'phone', 'address', 'city', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if customer already exists with this phone number
    console.log('Checking for existing customer with phone:', phone);
    const existingCustomer = await Customer.findOne({ phone });
    
    if (existingCustomer) {
      console.log('Customer already exists with phone:', phone);
      return res.status(400).json({
        success: false,
        message: 'A customer with this phone number already exists'
      });
    }

    // Create new customer
    console.log('Creating new customer...');
    const customer = await Customer.create({
      name,
      age,
      gender,
      phone,
      address,
      city,
      password
    });

    console.log('Customer created successfully:', {
      id: customer._id,
      name: customer.name,
      phone: customer.phone
    });

    // Generate token
    const token = generateToken(customer._id);

    console.log('Generated JWT token');
    console.log('=== Signup Process Complete ===\n');

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        token
      }
    });
  } catch (error) {
    console.error('\n=== Signup Error ===');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.error('Validation Errors:', messages);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    // Handle JWT errors
    if (error.message === 'JWT_SECRET is not defined in environment variables') {
      console.error('JWT Configuration Error');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    console.error('=== End of Error Log ===\n');
    res.status(500).json({
      success: false,
      message: 'Error creating customer account'
    });
  }
};

// @desc    Authenticate customer & get token
// @route   POST /api/auth/signin
// @access  Public
exports.signinCustomer = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validate input
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and password'
      });
    }

    // Find customer by phone and explicitly select password
    const customer = await Customer.findOne({ phone }).select('+password');

    // Check if customer exists
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Check if password matches
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Generate token
    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        token
      }
    });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during sign in'
    });
  }
};

// @desc    Get current customer profile
// @route   GET /api/auth/profile
// @access  Private
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: customer._id,
        name: customer.name,
        age: customer.age,
        gender: customer.gender,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        createdAt: customer.createdAt
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer profile'
    });
  }
}; 