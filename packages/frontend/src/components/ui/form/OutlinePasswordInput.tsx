import { useState, MouseEvent } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface IOutlinePasswordInput {
  name: string;
  control: any;
  error: FieldError | undefined;
  label: string;
  required: boolean;
}

export default function OutlinePasswordInput(props: IOutlinePasswordInput) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <Controller
      name={props.name}
      control={props.control as Control}
      render={({ field: { onChange, value } }) => (
        <>
          <FormControl
            variant="outlined"
            margin="normal"
            fullWidth
            error={!!props.error}
          >
            <InputLabel required={props.required}>{props.label}</InputLabel>
            <OutlinedInput
              label={props.label}
              type={showPassword ? 'text' : 'password'}
              onChange={onChange}
              value={value as string}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {!!props.error && (
              <FormHelperText error>{props.error.message}</FormHelperText>
            )}
          </FormControl>
        </>
      )}
    />
  );
}
