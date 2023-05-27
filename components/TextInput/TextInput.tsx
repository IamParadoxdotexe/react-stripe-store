import { ReactNode, useEffect, useMemo, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import styles from './TextInput.module.scss';

interface TextInputProps extends Omit<TextFieldProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  adornments?: {
    start?: ReactNode;
  };
  validator?: (value: string) => boolean;
  required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const [value, setValue] = useState<string>(props.value ?? '');
  const [hasChanged, setHasChanged] = useState(false);

  const { adornments, validator, ...textFieldProps } = props;

  const startAdornment = adornments?.start ? (
    <InputAdornment position="start">{adornments.start}</InputAdornment>
  ) : undefined;

  const valid = useMemo(
    () => (validator ? validator(value) : props.required ? !!value : true),
    [value]
  );

  useEffect(() => {
    if (props.value && props.value != value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    const v = valid ? value : '';
    if (props.value != v) {
      props.onChange?.(v);
    }
  }, [value]);

  const isError = !valid && hasChanged;

  return (
    <div className={`${styles.input} ${isError ? styles.error : ''}`}>
      {props.label && <label>{props.label}</label>}
      <TextField
        size="small"
        InputProps={{
          startAdornment
        }}
        className={styles.input__field}
        {...textFieldProps}
        label={undefined}
        value={value}
        onChange={e => {
          setHasChanged(true);
          setValue(e.target.value);
        }}
      />
    </div>
  );
};
