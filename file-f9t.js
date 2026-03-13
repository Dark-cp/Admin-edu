// frontend/src/services/studentService.js
import api from './api';

export const studentService = {
  getDashboard: () => api.get('/student/dashboard'),
  
  getEnrolledCourses: () => api.get('/student/courses'),
  
  getCourseDetails: (courseId) => api.get(`/student/courses/${courseId}`),
  
  getAssignments: (courseId) => 
    api.get(`/student/courses/${courseId}/assignments`),
  
  submitAssignment: (assignmentId, formData) => 
    api.post(`/student/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getGrades: () => api.get('/student/grades'),
  
  getMessages: () => api.get('/student/messages'),
  
  sendMessage: (messageData) => api.post('/student/messages', messageData),
  
  getAnnouncements: () => api.get('/student/announcements'),
  
  getResources: (courseId) => api.get(`/student/courses/${courseId}/resources`)
};