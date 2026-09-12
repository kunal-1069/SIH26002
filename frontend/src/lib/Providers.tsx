'use client';

import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { QueryProvider } from './QueryProvider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        <Toaster position="top-right" />
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
