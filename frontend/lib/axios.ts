import axios, { AxiosError } from 'axios';

const getBaseURL = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const trimmed = envUrl.replace(/\/+$/, '');
  // If the URL already ends with /api, use it as is; otherwise append /api
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

// Request interceptor (attaches token from localStorage if present as fallback)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
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
