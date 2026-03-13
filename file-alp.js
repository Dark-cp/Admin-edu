// backend/src/models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  entity: { 
    type: String, 
    required: true 
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true 
  },
  changes: { type: Map, of: mongoose.Schema.Types.Mixed },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);