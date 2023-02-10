import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
export default function SignUpHeader() {
  const navigate = useNavigate();

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        sx={{ padding: 2 }}
        padding="2"
      >
        <Grid item>LOGO</Grid>
        <Grid item>
          <Link
            component="button"
            variant="subtitle2"
            ml="auto"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </>
  );
}
