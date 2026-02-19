import axios from 'axios';

const API_BASE_URL = 'https://code-alarm-2.onrender.com/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const login = async (credentials) => {
  return await api.post('/auth/login', credentials, { timeout: 60000 });
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData, { timeout: 60000 });
};

export const getUserProfile = async () => {
  return await api.get('/auth/profile');
};

export const updatePreferences = async (preferences) => {
  return await api.put('/auth/preferences', preferences);
};

export const getUserReminders = async () => {
  return await api.get('/reminders/my-reminders');
};

export const createReminder = async (reminderData) => {
  return await api.post('/reminders', reminderData);
};

export const updateReminder = async (id, reminderData) => {
  return await api.put(`/reminders/${id}`, reminderData);
};

export const deleteReminder = async (id) => {
  return await api.delete(`/reminders/${id}`);
};

export const getContests = async (params = {}) => {
  return await api.get('/contests', { params });
};

export const getContest = async (id) => {
  return await api.get(`/contests/${id}`);
};

export const addToFavorites = async (contestId) => {
  return await api.post(`/contests/${contestId}/favorite`);
};

export const removeFromFavorites = async (contestId) => {
  return await api.delete(`/contests/${contestId}/favorite`);
};

export const getFavoriteContests = async () => {
  return await api.get('/contests/favorites');
};

export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/auth/forgot-password', {
      email: data.email  
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });
    return response.data;
  } catch (error) {
    console.error('Forgot password error details:', error.response?.data);
    throw error;
  }
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export default api;
