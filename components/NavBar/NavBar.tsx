import React from 'react';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { Badge, IconButton, InputAdornment, TextField } from '@mui/material';
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
                <SearchOutlined />
              </InputAdornment>
            )
          }}
          color="secondary"
          className={styles.right__search}
        />
        <IconButton color="secondary">
          <Badge badgeContent={10} color="primary">
            <ShoppingCartOutlined />
          </Badge>
        </IconButton>
      </div>
    </div>
  );
};
