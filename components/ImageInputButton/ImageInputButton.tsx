import React, { ReactNode, useState } from 'react';
import { Button } from '@mui/material';
import styles from './ImageInputButton.module.scss';

type ImageInputButtonPros = {
  icon?: ReactNode;
  label?: string;
  onChange?: (image?: string) => void;
  className?: string;
  disabled?: boolean;
};

export const ImageInputButton: React.FC<ImageInputButtonPros> = (props: ImageInputButtonPros) => {
  const [ref, setRef] = useState<HTMLInputElement | null>();

  const onChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = () => props.onChange?.(fileReader.result as string);

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className={props.className}>
      <Button
        variant="contained"
        size="small"
        onClick={() => ref?.click()}
        startIcon={props.icon}
        className={`${styles.button} ${!props.label ? styles.icon : ''}`}
        disabled={props.disabled}
      >
        {props.label}
      </Button>
      <input
        ref={setRef}
        type="file"
        accept="image/png"
        className={styles.input}
        onChange={onChange}
      />
    </div>
  );
};
