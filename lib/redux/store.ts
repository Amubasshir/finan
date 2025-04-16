import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import loanApplicationReducer from './slices/loanApplicationSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loanApplication: loanApplicationReducer,
    [api.reducerPath]: api.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;