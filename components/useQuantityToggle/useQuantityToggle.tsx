import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import MinusIcon from '@/icons/Minus.svg';
import PlusIcon from '@/icons/Plus.svg';
import styles from './useQuantityToggle.module.scss';

type QuantityToggleProps = {
  initialValue?: number;
  max?: number;
  min?: number;
};

export const useQuantityToggle = (props?: QuantityToggleProps) => {
  const [quantity, setQuantity] = useState(props?.initialValue ?? 0);

  const max = props?.max ?? 10;
  const min = props?.min ?? 0;

  const QuantityToggle = () => (
    <div className={styles.toggle}>
      <IconButton
        size="small"
        color="primary"
        onClick={() => setQuantity(quantity - 1)}
        disabled={quantity <= min}
      >
        <MinusIcon fontSize="inherit" />
      </IconButton>
      <TextField className={styles.toggle__quantity} value={quantity} disabled />
      <IconButton
        size="small"
        color="primary"
        onClick={() => setQuantity(quantity + 1)}
        disabled={quantity >= max}
      >
        <PlusIcon fontSize="inherit" />
      </IconButton>
    </div>
  );

  return { QuantityToggle, quantity, setQuantity };
};
