import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
  Button,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  FormatListBulleted as ListIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  Cake as CakeIcon,
  CelebrationOutlined as CelebrationIcon,
  NotificationsActive as NotificationsIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 240;

const menuItems = [
  { 
    text: 'Home',
    icon: <CelebrationIcon sx={{ color: 'primary.main' }} />,
    path: '/',
    description: 'View upcoming birthdays'
  },
  { 
    text: 'List',
    icon: <ListIcon sx={{ color: 'info.main' }} />,
    path: '/list',
    description: 'Manage your birthday list'
  },
  { 
    text: 'Calendar',
    icon: <CalendarIcon sx={{ color: 'success.main' }} />,
    path: '/calendar',
    description: 'View birthdays in calendar'
  },
  { 
    text: 'Settings',
    icon: <NotificationsIcon sx={{ color: 'warning.main' }} />,
    path: '/settings',
    description: 'Configure notifications'
  },
  { 
    text: 'About',
    icon: <InfoIcon sx={{ color: 'secondary.main' }} />,
    path: '/about',
    description: 'About Remind Candles'
  },
];

export const Navigation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOutUser } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Add Login menu item conditionally
  const allMenuItems = user ? menuItems : [
    ...menuItems,
    { 
      text: 'Sign In',
      icon: <LoginIcon sx={{ color: 'error.main' }} />,
      path: '/login',
      description: 'Sign in to access all features'
    }
  ];

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'primary.main',
        }}
      >
        <CakeIcon />
        <Typography variant="h6" component="div">
          Remind Candles
        </Typography>
      </Box>
      
      {/* User Info Section */}
      {user && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar 
              src={user.photoURL || ''} 
              alt={user.displayName || 'User'}
              sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {user.displayName || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            fullWidth
            variant="outlined"
            color="secondary"
          >
            Sign Out
          </Button>
        </Box>
      )}

      <List>
        {allMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip 
              title={item.description}
              placement="right"
              TransitionComponent={Zoom}
              arrow
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    transform: 'scale(1.02)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    borderLeft: 3,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexGrow: 1,
            }}
          >
            <CakeIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              Remind Candles
            </Typography>
          </Box>
          
          {/* User Info in Top Bar - Desktop only */}
          {!isMobile && user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                src={user.photoURL || ''} 
                alt={user.displayName || 'User'}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="subtitle2">
                {user.displayName || 'User'}
              </Typography>
              <Button
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
                color="inherit"
              >
                Sign Out
              </Button>
            </Box>
          )}
          
          {/* Sign In Button - Desktop only, when not signed in */}
          {!isMobile && !user && (
            <Button
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              color="primary"
              variant="contained"
              size="small"
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
};
