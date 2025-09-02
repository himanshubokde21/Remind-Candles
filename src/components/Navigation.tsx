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
} from '@mui/material';
import {
  Menu as MenuIcon,
  FormatListBulleted as ListIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  Cake as CakeIcon,
  CelebrationOutlined as CelebrationIcon,
  NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';

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
      <List>
        {menuItems.map((item) => (
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
            }}
          >
            <CakeIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              Remind Candles
            </Typography>
          </Box>
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
