import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Container from '@mui/material/Container';
import { Auth } from 'aws-amplify';
import Link from '@mui/material/Link';
import {
  CognitoAuthCode,
  ICognitoAuthError,
} from '../components/auth/Cognito-errors';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const registerSchema = object({
  confirmationCode: string().min(1, 'Please Enter Confirmation Code'),
  newPassword: string()
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
});
type RegisterInput = TypeOf<typeof registerSchema>;

interface LocationState {
  username: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      confirmationCode: '',
      newPassword: '',
    },
  });

  const resendConfirmationCode = async () => {
    try {
      await Auth.forgotPassword(state.username);
      enqueueSnackbar(
        `Confirmation code successfully sent to ${state.username}`,
        {
          variant: 'success',
        }
      );
    } catch (error) {
      const cognitoError = error as ICognitoAuthError;
      switch (cognitoError.code) {
        case CognitoAuthCode.UsernameExistsException:
          enqueueSnackbar(cognitoError.message, {
            variant: 'error',
          });
          navigate('/login');
          break;
        default:
          enqueueSnackbar(cognitoError.message, {
            variant: 'error',
          });
      }
    }
  };

  useEffect(() => {
    if (!state?.username) {
      navigate('/login');
      return;
    }
    void resendConfirmationCode();
  }, []);

  const onSubmit: SubmitHandler<RegisterInput> = async (formData) => {
    try {
      await Auth.forgotPasswordSubmit(
        state.username,
        formData.confirmationCode,
        formData.newPassword
      );
      enqueueSnackbar(`Password successfully changed`, {
        variant: 'success',
      });
      navigate('/login');
    } catch (error) {
      const cognitoError = error as ICognitoAuthError;
      switch (cognitoError.code) {
        case CognitoAuthCode.UsernameExistsException:
          enqueueSnackbar(cognitoError.message, {
            variant: 'error',
          });
          navigate('/login');
          break;
        case CognitoAuthCode.CodeMismatchException:
          setError('confirmationCode', {
            type: 'server',
            message: cognitoError.message,
          });
          break;
        case CognitoAuthCode.InvalidPasswordException:
          setError('newPassword', {
            type: 'server',
            message: cognitoError.message,
          });
          break;
        default:
          enqueueSnackbar(cognitoError.message, {
            variant: 'error',
          });
      }
    }
  };

  return (
    <div>
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
          <Typography component="div" variant="subtitle2" textAlign="center">
            Enter your activation code. We've sent it to {state.username}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
            sx={{ mt: 3, width: '100%' }}
          >
            <Controller
              name={'confirmationCode'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmationCode"
                  label="Confirmation Code"
                  name="confirmationCode"
                  onChange={onChange}
                  value={value}
                  error={!!errors['confirmationCode']}
                  helperText={
                    errors['confirmationCode']
                      ? errors['confirmationCode'].message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name={'newPassword'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="newPassword"
                  label="New password"
                  name="newPassword"
                  onChange={onChange}
                  value={value}
                  error={!!errors['newPassword']}
                  helperText={
                    errors['newPassword'] ? errors['newPassword'].message : ''
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
        <div>
          <Link
            component="button"
            variant="subtitle2"
            onClick={() => void resendConfirmationCode()}
          >
            Resend Confirmation Code
          </Link>
        </div>
        <div>
          <Link
            component="button"
            variant="subtitle2"
            onClick={() => navigate('/login')}
          >
            Use a Different Email Address
          </Link>
        </div>
        <div>
          <Link
            component="button"
            variant="subtitle2"
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </Container>
    </div>
  );
}
