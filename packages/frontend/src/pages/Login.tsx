import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';
import { object, string, TypeOf } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import {
  CognitoAuthCode,
  ICognitoAuthError,
} from '../components/auth/Cognito-errors';
import OutlinePasswordInput from '../components/ui/form/OutlinePasswordInput';
import { useSnackbar } from 'notistack';
import { useUserStore } from '../store/user';

const theme = createTheme();

const registerSchema = object({
  email: string().email('Email is invalid'),
  password: string()
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
});

type RegisterInput = TypeOf<typeof registerSchema>;

function Login() {
  const navigate = useNavigate();
  const setIsAuth = useUserStore((state) => state.setIsAuth);
  const { enqueueSnackbar } = useSnackbar();

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
      await Auth.signIn(data.email, data.password);
      setIsAuth(true);
    } catch (error) {
      const cognitoError = error as ICognitoAuthError;
      if (cognitoError.code === CognitoAuthCode.UserNotConfirmedException) {
        navigate('/verify-email', { state: { username: data.email } });
      } else {
        enqueueSnackbar(cognitoError.message, {
          variant: 'error',
        });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
            noValidate
            sx={{ mt: 1, width: 1 }}
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
                  autoFocus
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
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isSubmitting}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
