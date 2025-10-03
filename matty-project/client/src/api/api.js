import axios from 'axios';

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
