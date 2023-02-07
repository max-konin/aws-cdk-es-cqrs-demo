import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import Link from '@mui/material/Link';
import { ICognitoAuthError } from '../components/auth/Cognito-errors';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const registerSchema = object({
  activationCode: string().min(1, 'Please Enter Activation Code'),
});
type RegisterInput = TypeOf<typeof registerSchema>;

interface LocationState {
  username: string;
}

export default function VerifyEmail() {
  const { setIsAuth } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [username] = useState(state?.username);
  useEffect(() => {
    if (!state?.username) {
      navigate('/login');
    }
    const hubAuthListener = Hub.listen('auth', ({ payload }) => {
      const { event } = payload;
      if (event === 'autoSignIn') {
        setIsAuth(true);
        navigate('/');
      } else if (event === 'autoSignIn_failure') {
        navigate('/login');
      }
    });
    return hubAuthListener;
  }, []);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      activationCode: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (formData) => {
    try {
      await Auth.confirmSignUp(username, formData.activationCode);
    } catch (error) {
      const cognitoError = error as ICognitoAuthError;
      setError('activationCode', {
        type: 'server',
        message: cognitoError.message,
      });
    }
  };
  const resendActivationCode = async () => {
    try {
      await Auth.resendSignUp(username);
      enqueueSnackbar(`Activation code successfully sent to ${username}`, {
        variant: 'success',
      });
    } catch (error) {
      const cognitoError = error as ICognitoAuthError;
      setError('activationCode', {
        type: 'server',
        message: cognitoError.message,
      });
    }
  };

  return (
    <>
      {username && (
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
              <Typography
                component="div"
                variant="subtitle2"
                textAlign="center"
              >
                Enter your activation code. We've sent it to {username}
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
            <Typography component="div" variant="subtitle2">
              Can't find the email?
            </Typography>
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => void resendActivationCode()}
            >
              Resend Activation Code
            </Link>
            <div>
              <Link href="/login" variant="subtitle2">
                Use a Different Email Address
              </Link>
            </div>
          </Container>
        </>
      )}
    </>
  );
}
