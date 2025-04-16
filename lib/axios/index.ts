import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Show error toast for non-auth errors
    if (error.response?.status !== 401) {
      toast.error('Error', {
        description: message,
      });
    }
    
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired', {
            description: 'Your session has expired. Please log in again.',
          });
          
          // Use window.location for hard redirect to clear state
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;