import React, { ReactNode } from 'react';
import styles from './Visual.module.scss';

type VisualProps = {
  visual: ReactNode;
  title: string;
  subtitle: string;
};

export const Visual: React.FC<VisualProps> = (props: VisualProps) => {
  return (
    <div className={styles.visual}>
      {props.visual}
      <div>
        <div className={styles.visual__title}>{props.title}</div>
        <div className={styles.visual__subtitle}>{props.subtitle}</div>
      </div>
    </div>
  );
};
