import React, { useEffect, useState } from 'react';
import { CartService } from '@/services/CartService';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { Badge, IconButton, InputAdornment, TextField } from '@mui/material';
import styles from './NavBar.module.scss';

export const NavBar: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    CartService.cartCount.subscribe(setCartCount);
  });

  return (
    <div className={styles.navBar}>
      Business Name
      <div className={styles.navBar__right}>
        <TextField
          placeholder="Search"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            )
          }}
          className={styles.right__search}
        />
        <IconButton color="secondary" onClick={() => cartCount && CartService.checkout()}>
          <Badge badgeContent={cartCount} color="primary">
            <ShoppingCartOutlined />
          </Badge>
        </IconButton>
      </div>
    </div>
  );
};
