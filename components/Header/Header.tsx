import React, { CSSProperties, ReactNode } from 'react';
import { Skeleton } from '@/components/Skeleton';
import styles from './Header.module.scss';

type HeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  style?: CSSProperties;
  loading?: boolean;
};

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <div className={styles.header} style={props.style}>
      <div>
        <Skeleton className={styles.header__title} loading={props.loading}>
          {props.title}
        </Skeleton>
        {props.subtitle && (
          <Skeleton className={styles.header__subtitle} loading={props.loading}>
            {props.subtitle}
          </Skeleton>
        )}
      </div>

      <div>{props.right}</div>
    </div>
  );
};
