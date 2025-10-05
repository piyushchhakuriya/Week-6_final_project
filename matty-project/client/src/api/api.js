import axios from "axios";

// Base URL for API: uses environment variable if set, otherwise localhost
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// Authenticated request helpers
export const authAPI = {
  login: async ({ email, password }) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  },
  // Optionally add register, logout, or other endpoints here
};

// Token header utility for authenticated API requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Token (and auth data) management helpers
export const tokenManager = {
  setToken: (token) => localStorage.setItem("token", token),
  getToken: () => localStorage.getItem("token"),
  clearToken: () => localStorage.removeItem("token"),
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default API;
