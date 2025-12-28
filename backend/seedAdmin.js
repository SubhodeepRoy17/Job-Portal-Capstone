const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@jobportal.com' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 Password: Admin@123 (if using default)');
      mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@jobportal.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1234567890',
      address: 'Admin Headquarters'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@jobportal.com');
    console.log('🔑 Password: Admin@123');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();