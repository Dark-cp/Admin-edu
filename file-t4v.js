// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8,
    select: false
  },
  role: { 
    type: String, 
    enum: ['admin', 'staff', 'student'],
    required: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: String,
  forcePasswordChange: { type: Boolean, default: false },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

// Password validation
userSchema.path('password').validate(function(value) {
  if (this.forcePasswordChange) return true;
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}, 'Password must contain uppercase, lowercase, number, and special character');

// Password hashing
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);