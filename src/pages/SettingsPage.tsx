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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext';
import type { NotificationSound } from '../types/notification';
import { WishLibrary } from '../components/WishLibrary';

const NOTIFICATION_SOUNDS: Record<NotificationSound, string> = {
  'soft-chime': 'Soft Chime',
  'birthday-tune': 'Birthday Tune',
  'loud-alert': 'Loud Alert'
};

const ADVANCE_DAYS = [
  { value: 0, label: 'Same day' },
  { value: 1, label: '1 day before' },
  { value: 3, label: '3 days before' }
] as const;

export const SettingsPage = () => {
  const { hasPermission, requestPermission, settings, updateSettings } = useNotifications();
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

  const handleSoundChange = (sound: NotificationSound) => {
    updateSettings({ ...settings, sound });
    // Play a preview of the selected sound
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.play().catch(console.error);
  };

  const handleAdvanceDaysChange = (days: number) => {
    updateSettings({ ...settings, advanceDays: days as 0 | 1 | 3 });
  };

  const handleResetClick = () => {
    // Reset all settings to default
    updateSettings({
      enabled: false,
      sound: 'soft-chime',
      advanceDays: 0
    });
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
        <Alert severity="success" sx={{ mb: 3 }}>
          Notifications enabled successfully!
        </Alert>
      )}

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={hasPermission}
              onChange={handlePermissionChange}
              color="primary"
            />
          }
          label="Enable Browser Notifications"
        />

        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="sound-select-label">Notification Sound</InputLabel>
            <Select
              labelId="sound-select-label"
              value={settings.sound}
              label="Notification Sound"
              onChange={(e) => handleSoundChange(e.target.value as NotificationSound)}
            >
              {Object.entries(NOTIFICATION_SOUNDS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="advance-days-label">Send Notifications</InputLabel>
            <Select
              labelId="advance-days-label"
              value={settings.advanceDays}
              label="Send Notifications"
              onChange={(e) => handleAdvanceDaysChange(Number(e.target.value))}
            >
              {ADVANCE_DAYS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </FormGroup>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Birthday Wishes
        </Typography>
        <WishLibrary />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleResetClick}
          sx={{ mt: 2 }}
        >
          Reset All Settings
        </Button>
      </Box>
    </Paper>
  );
};
