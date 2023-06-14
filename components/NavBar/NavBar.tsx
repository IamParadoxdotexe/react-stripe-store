import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import React, { KeyboardEvent, useState } from 'react';
import { CartButton } from '@/components/CartButton';
import { TextInput } from '@/components/TextInput';
import SearchIcon from '@/icons/Search.svg';
import styles from './NavBar.module.scss';

export const NavBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && query.length) {
      router.push(`/search?query=${query}`);
    }
  };

  const isAdminPath = router.pathname.startsWith('/admin');
  const isSignInPath = router.pathname.startsWith('/sign-in');

  const hideSearch = isAdminPath || isSignInPath;

  return (
    <div className={styles.navBar}>
      <div onClick={() => router.push('/')}>Business Name</div>
      {!hideSearch && (
        <div className={styles.navBar__right}>
          <TextInput
            placeholder="Search"
            value={query}
            onChange={setQuery}
            adornments={{ start: <SearchIcon /> }}
            onKeyDown={onKeyDown}
          />
          <CartButton />
        </div>
      )}
      {isAdminPath && <UserButton />}
    </div>
  );
};
