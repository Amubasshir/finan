import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define user interface
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Define auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks for authentication
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    receiveUpdates?: boolean;
    agreeTerms: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
      return null;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.token) {
        return rejectWithValue('No token available');
      }
      
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    },
    initializeAuth: (state) => {
      // Check if we have a token and user data in localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          try {
            state.token = token;
            state.user = JSON.parse(userData);
            state.isAuthenticated = true;
          } catch (error) {
            // If parsing fails, clear the invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('userData', JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('userData', JSON.stringify(action.payload.user));
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        
        // If token is invalid, clear credentials
        if (action.payload === 'Invalid token' || action.payload === 'Token expired') {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
          }
        }
      });
  },
});

export const { setCredentials, clearCredentials, initializeAuth } = authSlice.actions;

export default authSlice.reducer;