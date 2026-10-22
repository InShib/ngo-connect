import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ngo_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper methods for localStorage User Session
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('ngo_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any, token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ngo_user', JSON.stringify(user));
  localStorage.setItem('ngo_token', token);
};

export const clearStoredSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ngo_user');
  localStorage.removeItem('ngo_token');
};
