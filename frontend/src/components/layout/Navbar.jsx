import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Chip } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Logout } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Payment Transactions System
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAdmin() && (
              <Chip label="Admin" color="secondary" size="small" />
            )}
            <Typography variant="body1" sx={{ display: { xs: 'none', md: 'block' } }}>
              {user.username}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} fontSize="small" />
                Выход
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
