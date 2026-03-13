// backend/src/controllers/adminController.js
const User = require('../models/User');
const Course = require('../models/Course');
const AuditLog = require('../models/AuditLog');
const { logAdminAction } = require('../utils/auditLogger');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalStaff, totalCourses, recentUsers] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'staff', isActive: true }),
      Course.countDocuments({ isActive: true }),
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('firstName lastName email role createdAt')
    ]);

    // Get system activity from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await AuditLog.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalStaff,
        totalCourses,
        recentUsers,
        systemActivity: recentActivity,
        systemHealth: {
          cpuUsage: Math.random() * 100, // Replace with actual metrics
          memoryUsage: Math.random() * 100,
          diskUsage: Math.random() * 100
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      forcePasswordChange: role !== 'admin' // Force password change for non-admin users
    });

    // Log action
    await logAdminAction(req.user._id, 'CREATE_USER', 'User', user._id, {
      email,
      role,
      firstName,
      lastName
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log action
    await logAdminAction(req.user._id, 'UPDATE_USER', 'User', id, updates);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log action
    await logAdminAction(
      req.user._id, 
      isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      'User', 
      id,
      { isActive }
    );

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk user operations
exports.bulkImportUsers = async (req, res) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'Invalid users data' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const userData of users) {
      try {
        // Validate required fields
        if (!userData.email || !userData.role || !userData.firstName || !userData.lastName) {
          results.failed++;
          results.errors.push({ email: userData.email, error: 'Missing required fields' });
          continue;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          results.failed++;
          results.errors.push({ email: userData.email, error: 'User already exists' });
          continue;
        }

        // Create user
        await User.create({
          email: userData.email,
          password: userData.password || 'Temp@1234', // Default temporary password
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          forcePasswordChange: true
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ email: userData.email, error: error.message });
      }
    }

    // Log action
    await logAdminAction(req.user._id, 'BULK_IMPORT_USERS', 'User', null, {
      total: users.length,
      success: results.success,
      failed: results.failed
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};