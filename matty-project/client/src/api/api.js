const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

let authToken = null;
let currentUser = null;

export const tokenManager = {
  setToken: (token) => {
    authToken = token;
  },
  
  getToken: () => {
    return authToken;
  },
  
  removeToken: () => {
    authToken = null;
  },
  
  setUser: (user) => {
    currentUser = user;
  },
  
  getUser: () => {
    return currentUser;
  },
  
  removeUser: () => {
    currentUser = null;
  },
  
  clearAuth: () => {
    authToken = null;
    currentUser = null;
  }
};

const apiRequest = async (endpoint, options = {}) => {
  const token = tokenManager.getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      tokenManager.clearAuth();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      tokenManager.setToken(response.token);
      tokenManager.setUser(response.user);
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      tokenManager.setToken(response.token);
      tokenManager.setUser(response.user);
    }
    
    return response;
  },

  logout: () => {
    tokenManager.clearAuth();
  },

  verifyToken: async () => {
    return await apiRequest('/auth/verify', {
      method: 'GET',
    });
  },

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, newPassword) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  },
};



export default {
  auth: authAPI,
};