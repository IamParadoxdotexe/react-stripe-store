import React, { ReactNode } from 'react';
import { DrawerService } from '@/services/DrawerService';
import { IconButton } from '@mui/material';
import CancelIcon from '@/icons/Cancel.svg';
import styles from './BaseDrawer.module.scss';

type BaseDrawerProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export const BaseDrawer: React.FC<BaseDrawerProps> = (props: BaseDrawerProps) => {
  return (
    <div className={styles.drawer}>
      <div className={styles.drawer__header}>
        <div>
          <div className={styles.header__title}>{props.title}</div>
          <div className={styles.header__subtitle}>{props.subtitle}</div>
        </div>
        <IconButton size="small" onClick={DrawerService.close}>
          <CancelIcon />
        </IconButton>
      </div>

      {props.children}
    </div>
  );
};
