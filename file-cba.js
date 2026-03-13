// backend/src/utils/auditLogger.js
const AuditLog = require('../models/AuditLog');

const logAdminAction = async (adminId, action, entity, entityId, changes = {}) => {
  try {
    await AuditLog.create({
      user: adminId,
      action,
      entity,
      entityId,
      changes,
      ipAddress: '127.0.0.1', // Get from request in actual implementation
      userAgent: 'Mozilla/5.0' // Get from request in actual implementation
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};

module.exports = { logAdminAction };