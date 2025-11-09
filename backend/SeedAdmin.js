const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Customer = require('./models/Customer');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pharmacy';

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);

  const adminPhone = '03333333333'; // Set your admin phone number here
  const adminPassword = 'Admin@123'; // Set your admin password here

  // Check if admin already exists
  const existingAdmin = await Customer.findOne({ phone: adminPhone, IsAdmin: true });
  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.phone);
    await mongoose.disconnect();
    return;
  }

  // No manual hashing here; let the model hash the password

  // Create admin user with all required fields
  const admin = new Customer({
    name: 'Admin', // at least 2 chars
    age: 30, // between 18 and 100
    gender: 'male', // must be 'male' or 'female'
    phone: adminPhone,
    address: 'Admin Address', // at least 10 chars
    city: 'AdminCity', // any string
    password: adminPassword, // plain password, will be hashed by pre-save hook
    IsAdmin: true
  });

  await admin.save();
  console.log('Admin user created:', admin.phone);
  await mongoose.disconnect();
}

seedAdmin().catch(err => {
  console.error('Error seeding admin:', err);
  mongoose.disconnect();
});