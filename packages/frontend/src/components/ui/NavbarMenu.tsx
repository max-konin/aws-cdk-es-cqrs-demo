import { MouseEvent, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useLogout } from '../../hooks/useLogout';
import { useDeleteUser } from '../../hooks/useDeleteUser';

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const logout = useLogout();
  const deleteUser = useDeleteUser();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settingAction = (cb: () => Promise<void>) => () => {
    handleCloseUserMenu();
    void cb();
  };

  const settings = [
    {
      text: 'Logout',
      action: settingAction(logout),
    },
    {
      text: 'Delete user',
      action: settingAction(deleteUser),
    },
  ];

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt="User Sharp"
            src="/assets/images/tl-logo-only-white.png"
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting.text} onClick={setting.action}>
            <Typography textAlign="center">{setting.text}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Navbar;
