// frontend/src/services/staffService.js
import api from './api';

export const staffService = {
  getDashboard: () => api.get('/staff/dashboard'),
  
  getAssignedCourses: () => api.get('/staff/courses'),
  
  getCourseRoster: (courseId) => api.get(`/staff/courses/${courseId}/roster`),
  
  createAssignment: (courseId, assignmentData) => 
    api.post(`/staff/courses/${courseId}/assignments`, assignmentData),
  
  getAssignments: (courseId) => 
    api.get(`/staff/courses/${courseId}/assignments`),
  
  gradeSubmission: (submissionId, gradeData) => 
    api.patch(`/staff/submissions/${submissionId}/grade`, gradeData),
  
  getSubmissions: (assignmentId) => 
    api.get(`/staff/assignments/${assignmentId}/submissions`),
  
  recordAttendance: (courseId, attendanceData) => 
    api.post(`/staff/courses/${courseId}/attendance`, attendanceData),
  
  getMessages: () => api.get('/staff/messages'),
  
  sendMessage: (messageData) => api.post('/staff/messages', messageData),
  
  getAnnouncements: () => api.get('/staff/announcements'),
  
  createAnnouncement: (announcementData) => 
    api.post('/staff/announcements', announcementData)
};