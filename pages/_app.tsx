import { ThemeProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import styles from './index.module.scss';

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['latin']
});

const theme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    fontFamily: inter.style.fontFamily
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={`${inter.className} ${styles.main}`}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
