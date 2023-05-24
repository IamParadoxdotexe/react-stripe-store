import '@/styles/global.scss';
import { ThemeProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { getStyleExports } from '@/utils/functions/getStyleExports';
import { useServiceState } from '@/utils/hooks/useServiceState';
import { CartService } from '@/services/CartService';
import { ProductService } from '@/services/ProductService';
import { PusherService } from '@/services/PusherService';
import { Grow, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { CartButton } from '@/components/CartButton';
import { NavBar } from '@/components/NavBar/NavBar';
import { useDrawer } from '@/components/drawers/useDrawer';

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
  const cart = useServiceState(CartService.cart);

  const { Drawer } = useDrawer();

  useEffect(() => {
    PusherService.bind();
    ProductService.load();

    return () => PusherService.unbind();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={`${inter.className}`}>
        <NavBar />
        <Component {...pageProps} />

        {Drawer}

        <Grow in={cart.count > 0}>
          <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
            <CartButton type="fab" />
          </div>
        </Grow>
      </main>
    </ThemeProvider>
  );
}
