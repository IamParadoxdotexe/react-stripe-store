import Image from 'next/image';
import React from 'react';
import styles from './Splash.module.scss';

export const Splash: React.FC = () => {
  return (
    <div className={styles.splash}>
      <div className={styles.splash__title}>Find just what you were looking for</div>
      <Image src="/splash.png" alt="Splash image" width={1200} height={700} priority />
    </div>
  );
};
