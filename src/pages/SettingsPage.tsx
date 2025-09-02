import { useState } from 'react';
import {
  Typography,
  Paper,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext';

export const SettingsPage = () => {
  const { hasPermission, requestPermission } = useNotifications();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePermissionChange = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (granted) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h4" gutterBottom color="primary">
        Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Notification permissions granted successfully!
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={hasPermission}
                onChange={handlePermissionChange}
                color="primary"
              />
            }
            label="Enable Birthday Notifications"
          />
        </FormGroup>
        {!hasPermission && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handlePermissionChange}
            sx={{ mt: 1 }}
          >
            Enable Notifications
          </Button>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Allow notifications to receive birthday reminders and celebrations
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Default Birthday Message
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Customize the message that will be sent in birthday notifications
        </Typography>
        {/* We can add message customization features here in the future */}
      </Box>
    </Paper>
  );
};
