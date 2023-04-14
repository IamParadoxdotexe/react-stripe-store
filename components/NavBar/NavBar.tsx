import React, { useEffect, useState } from 'react';
import { CartService } from '@/services/CartService';
import { InputAdornment, TextField } from '@mui/material';
import { CartButton } from '@/components/CartButton';
import SearchIcon from '@/icons/Search.svg';
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
                <SearchIcon />
              </InputAdornment>
            )
          }}
          className={styles.right__search}
        />
        <CartButton />
      </div>
    </div>
  );
};
