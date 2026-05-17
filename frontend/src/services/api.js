import axios from 'axios';

// In production the backend serves the frontend, so API is on the same host
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/users')
};

// Inventory API
export const inventoryAPI = {
  // Received Yarn
  createReceivedYarn: (data) => api.post('/inventory/received', data),
  getReceivedYarn: () => api.get('/inventory/received'),

  // Issued Yarn
  createIssuedYarn: (data) => api.post('/inventory/issued', data),

  // Rejected Yarn
  createRejectedYarn: (data) => api.post('/inventory/rejected', data),

  // QC Yarn
  createQCYarn: (data) => api.post('/inventory/qc', data),
  updateQCStatus: (qcId, data) => api.put(`/inventory/qc/${qcId}`, data),

  // Stock & Search
  getInventoryStatus: () => api.get('/inventory/status'),
  searchInventory: (query, filters) => api.get('/inventory/search', { params: { q: query, ...filters } }),

  // Analytics
  getAnalytics: () => api.get('/inventory/analytics')
};

// Reports API
export const reportsAPI = {
  getAuditLogs: (filters) => api.get('/reports/audit-logs', { params: filters }),
  exportToExcel: () => api.get('/reports/export/excel', { responseType: 'blob' }),
  exportToPDF: () => api.get('/reports/export/pdf', { responseType: 'blob' })
};

export default api;
