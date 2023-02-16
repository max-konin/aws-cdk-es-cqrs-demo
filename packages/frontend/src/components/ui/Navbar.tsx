import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import NavbarMenu from './NavbarMenu';

const links = [
  {
    text: 'Main',
    to: '/',
  },
  {
    text: 'Shipments',
    to: '/shipments',
  },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TRADELANES
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {links.map((link) => (
              <Button
                key={link.to}
                onClick={() => navigate(link.to)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {link.text}
              </Button>
            ))}
          </Box>

          <NavbarMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
