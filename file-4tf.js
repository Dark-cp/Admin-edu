// backend/src/models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  maxPoints: { type: Number, default: 100 },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    submittedAt: Date,
    score: Number,
    feedback: String,
    status: { 
      type: String, 
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted'
    }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);