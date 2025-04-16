'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect } from 'react';
import { initializeAuth } from './slices/authSlice';

export function Providers({ children }: { children: ReactNode }) {
  // Initialize auth state from localStorage on client side
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}