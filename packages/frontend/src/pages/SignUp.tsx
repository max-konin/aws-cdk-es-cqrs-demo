import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpHeader from '../components/auth/SignUpHeader';
import Container from '@mui/material/Container';

// .refine((data) => data.password === data.passwordConfirm, {
//   path: ['passwordConfirm'],
//   message: 'Passwords do not match',
// });

const registerSchema = object({
  email: string().email('Email is invalid'),
  password: string()
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  // passwordConfirm: string().nonempty('Please confirm your password'),
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
    },
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      await Auth.signUp({
        username: data.email,
        password: data.password,
      });
      navigate('/verify-email');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('1:', error?.message as string);
      // TODO parse aws error
      return false;
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
        <Box
          component="form"
          noValidate
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name={'email'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
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
            </Grid>
            <Grid item xs={12}>
              <Controller
                name={'password'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={onChange}
                    value={value}
                    error={!!errors['password']}
                    helperText={
                      errors['password'] ? errors['password'].message : ''
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
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
      </Box>
    </>
  );
}
