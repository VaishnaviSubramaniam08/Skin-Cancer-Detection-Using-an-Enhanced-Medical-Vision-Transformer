import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Predictions API
export const predictionsAPI = {
  predict: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/predictions/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPredictions: async () => {
    const response = await api.get('/predictions');
    return response.data;
  },

  getPrediction: async (id) => {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  },

  deletePrediction: async (id) => {
    const response = await api.delete(`/predictions/${id}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (name) => {
    const response = await api.put('/user/profile', { name });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },
};

export default api;
