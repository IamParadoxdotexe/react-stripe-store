import React from 'react';
import { ContentProps } from '@/utils/types/Content';
import { Header } from '@/components/Header';
import styles from './Grid.module.scss';

export const Grid: React.FC<ContentProps> = (props: ContentProps) => {
  return (
    <div className={styles.grid}>
      <Header title={props.title} subtitle={props.subtitle} loading={props.loading} />
      <div className={styles.grid__elements}>{props.children}</div>
    </div>
  );
};
