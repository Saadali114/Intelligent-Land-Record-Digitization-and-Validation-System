import axios, { AxiosError } from 'axios';

const getBaseURL = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() && !envUrl.includes('localhost')) {
    const trimmed = envUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  // Browser runtime detection on deployed cloud hosts
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('onrender.com') || (!host.includes('localhost') && !host.includes('127.0.0.1'))) {
      return 'https://ilrd-backend.onrender.com/api';
    }
  }
  const fallback = envUrl || 'http://localhost:5000/api';
  const trimmed = fallback.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const baseURL = getBaseURL();

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (attaches token and ensures cloud API endpoint in production browser)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (
        (host.includes('onrender.com') || (!host.includes('localhost') && !host.includes('127.0.0.1'))) &&
        (!config.baseURL || config.baseURL.includes('localhost'))
      ) {
        config.baseURL = 'https://ilrd-backend.onrender.com/api';
      }
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; message: string; error?: any }>) => {
    // Standardize error message extraction
    let message = error.response?.data?.message;
    if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
      const details = error.response.data.error.map((e: any) => e.message || `${e.field}: invalid`).filter(Boolean).join('. ');
      if (details && !message?.includes(details)) {
        message = message ? `${message} (${details})` : details;
      }
    }
    if (!message) {
      message = error.message || 'An unexpected error occurred. Please try again.';
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear credentials if token expired
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
