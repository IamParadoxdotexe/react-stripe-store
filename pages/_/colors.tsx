import React from 'react';
import { generateKeys } from '@/utils/functions/generateKeys';
import { getStyleExports } from '@/utils/functions/getStyleExports';
import styles from './colors.module.scss';

const styleExports = getStyleExports();

export default function Colors() {
  return (
    <div className={styles.palettes}>
      {styleExports.palettes.map((palette, i) => (
        <div key={palette} className={styles.palette}>
          {generateKeys(i > 1 ? 10 : 8).map(j => (
            <div key={j} className={styles[`${palette}-${j + 1}`]}></div>
          ))}
        </div>
      ))}
    </div>
  );
}
