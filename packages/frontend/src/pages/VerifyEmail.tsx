import * as React from 'react';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SignUpHeader from '../components/auth/SignUpHeader';
import Container from '@mui/material/Container';

const registerSchema = object({
  activationCode: string({
    required_error: 'Please Enter Activation Code',
  }),
});
type RegisterInput = TypeOf<typeof registerSchema>;

export default function VerifyEmail() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      activationCode: undefined,
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<RegisterInput> = () => {
    // TODO
  };
  return (
    <>
      <SignUpHeader />
      <Container maxWidth="xs">
        <Box
          sx={{
            width: '100%',
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
            Verify Your Email
          </Typography>
          <Typography component="div" variant="subtitle2">
            Enter your activation code. We've sent it to TODO
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
            sx={{ mt: 3, width: '100%' }}
          >
            <Controller
              name={'activationCode'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  fullWidth
                  id="activationCode"
                  label="Activation Code"
                  name="activationCode"
                  onChange={onChange}
                  value={value}
                  error={!!errors['activationCode']}
                  helperText={
                    errors['activationCode']
                      ? errors['activationCode'].message
                      : ''
                  }
                />
              )}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isSubmitting}
            >
              Next
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </>
  );
}
