import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpHeader from '../components/auth/SignUpHeader';
import {
  CognitoAuthCode,
  ICognitoAuthError,
} from '../components/auth/Cognito-errors';
import { Container } from '@mui/material';
import OutlinePasswordInput from '../components/ui/form/OutlinePasswordInput';

const registerSchema = object({
  email: string().email('Email is invalid'),
  password: string()
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(6, 'Password must be more than 6 characters'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

type RegisterInput = TypeOf<typeof registerSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      await Auth.signUp({
        username: data.email,
        password: data.password,
        autoSignIn: { enabled: true },
      });
      navigate('/verify-email', { state: { username: data.email } });
    } catch (error) {
      const cognitoError = error as ICognitoAuthError;
      if (cognitoError.code === CognitoAuthCode.UsernameExistsException) {
        navigate('/login');
      }
    }
  };
  return (
    <>
      <SignUpHeader />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ marginBottom: 2 }}>
          Try TradeLanes for free
        </Typography>
        <Typography component="div" variant="subtitle2">
          By signing up, I agree to the&nbsp;
          <Link href="#">TradeLanes Privacy Policy</Link>&nbsp;and&nbsp;
          <Link href="#">Terms of Service</Link>
        </Typography>
        <Container component="div" maxWidth="xs">
          <Box
            component="form"
            noValidate
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
            maxWidth="xs"
            sx={{ mt: 2 }}
          >
            <Controller
              name={'email'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={onChange}
                  value={value}
                  error={!!errors['email']}
                  helperText={errors['email'] ? errors['email'].message : ''}
                />
              )}
            />
            <OutlinePasswordInput
              name="password"
              control={control}
              error={errors['password']}
              label="Password"
              required={true}
            />
            <OutlinePasswordInput
              name="passwordConfirm"
              control={control}
              error={errors['passwordConfirm']}
              label="Password Confirm"
              required={true}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isSubmitting}
            >
              Sign Up
            </LoadingButton>
          </Box>
        </Container>
      </Box>
    </>
  );
}
