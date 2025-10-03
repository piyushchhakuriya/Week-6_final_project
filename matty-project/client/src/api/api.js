const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

<<<<<<< HEAD
// 1. Create the API instance at the very top
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 2. Now you can attach the request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. (Optional) helper for fetch-based calls
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// 4. Add authAPI export
export const authAPI = {
  login: async ({ email, password }) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },
  // ...other functions as needed
};

export const tokenManager = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  clearToken: () => localStorage.removeItem('token'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default API;
=======
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
>>>>>>> e88cc9014c75e4ee0a771c83a0ce5e1f8d49fd8a
