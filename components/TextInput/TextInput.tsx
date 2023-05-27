import { ReactNode, useEffect, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import styles from './TextInput.module.scss';

interface TextInputProps extends Omit<TextFieldProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  startAdornment?: ReactNode;
}

export const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const [value, setValue] = useState<string>(props.value ?? '');

  const startAdornment = props.startAdornment ? (
    <InputAdornment position="start">{props.startAdornment}</InputAdornment>
  ) : undefined;

  useEffect(() => {
    if (props.value != value) {
      setValue(value);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.value != value) {
      props.onChange?.(value);
    }
  }, [value]);

  return (
    <div className={styles.input}>
      {props.label && <label>{props.label}</label>}
      <TextField
        size="small"
        InputProps={{
          startAdornment
        }}
        className={styles.input__field}
        {...props}
        label={undefined}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
};
