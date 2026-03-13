// backend/scripts/initDb.js
const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const initDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create default admin user
      const admin = await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        forcePasswordChange: true
      });

      console.log('Default admin created:');
      console.log('Email:', process.env.ADMIN_EMAIL);
      console.log('Password:', process.env.DEFAULT_ADMIN_PASSWORD);
      console.log('Please change the password on first login!');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample data
    await createSampleData();

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

const createSampleData = async () => {
  // Create sample staff
  const staff = await User.create({
    email: 'john.smith@edu.com',
    password: 'Temp@1234',
    role: 'staff',
    firstName: 'John',
    lastName: 'Smith',
    forcePasswordChange: true
  });

  // Create sample students
  const students = await User.create([
    {
      email: 'student1@edu.com',
      password: 'Temp@1234',
      role: 'student',
      firstName: 'Alice',
      lastName: 'Johnson',
      forcePasswordChange: true
    },
    {
      email: 'student2@edu.com',
      password: 'Temp@1234',
      role: 'student',
      firstName: 'Bob',
      lastName: 'Williams',
      forcePasswordChange: true
    }
  ]);

  console.log('Sample data created');
};

initDatabase();