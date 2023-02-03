import * as React from 'react';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
export default function SignUpHeader() {
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
          <Link href="/login" variant="body2" ml="auto">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </>
  );
}
