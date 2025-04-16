import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

// Create our base API with authentication
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'LoanApplication', 'LoanInfo', 'Document'],
  endpoints: (builder) => ({
    // We'll define specific endpoints in separate files
  }),
});