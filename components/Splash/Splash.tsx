import React from 'react';
import styles from './Splash.module.scss';

export const Splash: React.FC = () => {
  return (
    <div className={styles.splash}>
      <div className={styles.splash__title}>Find just what you were looking for</div>
      <img src="/splash.png" alt="Splash image" />
    </div>
  );
};
