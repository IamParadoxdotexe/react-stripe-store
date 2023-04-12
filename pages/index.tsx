import { ThemeProvider } from '@emotion/react';
import { Inter } from 'next/font/google';

import { ShoppingCartOutlined } from '@mui/icons-material';
import { createTheme } from '@mui/material';
import Button from '@mui/material/Button';
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

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={`${inter.className} ${styles.main}`}>
        <Button variant="contained">
          <ShoppingCartOutlined fontSize="small" /> Checkout
        </Button>
      </main>
    </ThemeProvider>
  );
}
