import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { CartButton } from '@/components/CartButton';
import SearchIcon from '@/icons/Search.svg';
import styles from './NavBar.module.scss';

export const NavBar: React.FC = () => {
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
