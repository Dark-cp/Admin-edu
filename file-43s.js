// frontend/src/services/adminService.js
import api from './api';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  createUser: (userData) => api.post('/admin/users', userData),
  
  getAllUsers: (params) => api.get('/admin/users', { params }),
  
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  
  toggleUserStatus: (id, isActive) => 
    api.patch(`/admin/users/${id}/status`, { isActive }),
  
  bulkImportUsers: (users) => api.post('/admin/users/bulk-import', { users }),
  
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  
  getAllCourses: (params) => api.get('/admin/courses', { params }),
  
  updateCourse: (id, courseData) => api.put(`/admin/courses/${id}`, courseData),
  
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  
  createAnnouncement: (announcementData) => 
    api.post('/admin/announcements', announcementData),
  
  getSystemLogs: (params) => api.get('/admin/logs', { params }),
  
  exportData: (type, format) => 
    api.get(`/admin/export/${type}`, { 
      params: { format },
      responseType: 'blob'
    })
};