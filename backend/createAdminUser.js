const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./Model/User');

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/internshala-clone';

async function createAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@internarea.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('Email: admin@internarea.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@internarea.com',
      password: hashedPassword,
      role: 'admin',
      notificationEnabled: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@internarea.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdminUser();