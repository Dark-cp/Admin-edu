// backend/src/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  schedule: {
    startDate: Date,
    endDate: Date,
    meetings: [{
      day: String,
      startTime: String,
      endTime: String,
      location: String
    }]
  },
  resources: [{
    type: { type: String, enum: ['document', 'video', 'link', 'quiz'] },
    title: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);