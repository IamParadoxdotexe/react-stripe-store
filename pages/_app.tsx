import { ThemeProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { getStyleExports } from '@/utils/functions/getStyleExports';
import { PusherService } from '@/services/PusherService';
import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { NavBar } from '@/components/NavBar/NavBar';
import styles from './app.module.scss';

const styleExports = getStyleExports();

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  style: ['normal'],
  subsets: ['latin']
});

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily
  },
  palette: {
    primary: {
      light: styleExports.primaryLight,
      main: styleExports.primary,
      dark: styleExports.primaryDark,
      contrastText: styleExports.light
    },
    secondary: {
      light: styleExports.secondaryLight,
      main: styleExports.secondary,
      dark: styleExports.secondaryDark,
      contrastText: styleExports.light
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    PusherService.bind();

    return () => PusherService.unbind();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main id={styles.app} className={`${inter.className}`}>
        <NavBar />
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
