import { useRouter } from 'next/router';
import React, { KeyboardEvent, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { CartButton } from '@/components/CartButton';
import SearchIcon from '@/icons/Search.svg';
import styles from './NavBar.module.scss';

export const NavBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Enter' && query.length) {
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <div className={styles.navBar}>
      <div onClick={() => router.push('/')}>Business Name</div>
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
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <CartButton />
      </div>
    </div>
  );
};
