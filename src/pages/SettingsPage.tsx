import { useState } from "react";
import {
  Typography,
  Paper,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Alert,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useNotifications } from "../contexts/NotificationContext";
import { useTheme } from "../contexts/ThemeContext";
import type { NotificationSound } from "../types/notification";
import { WishLibrary } from "../components/WishLibrary";

const NOTIFICATION_SOUNDS: Record<NotificationSound, string> = {
  "soft-chime": "Soft Chime",
  "birthday-tune": "Birthday Tune",
  "loud-alert": "Loud Alert",
};

const ADVANCE_DAYS = [
  { value: 0, label: "Same day" },
  { value: 1, label: "1 day before" },
  { value: 3, label: "3 days before" },
] as const;

export const SettingsPage = () => {
  const { hasPermission, requestPermission, settings, updateSettings } =
    useNotifications();
  const { settings: themeSettings, toggleMode } = useTheme();
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
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.play().catch(console.error);
  };

  const handleAdvanceDaysChange = (days: number) => {
    updateSettings({ ...settings, advanceDays: days as 0 | 1 | 3 });
  };

  const handleResetClick = () => {
    updateSettings({
      enabled: false,
      sound: "soft-chime",
      advanceDays: 0,
    });
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 6,
        background: "background.paper",
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        my: 6,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          textAlign: "center",
          mb: 4,
        }}
      >
        ⚙️ Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Notifications enabled successfully!
        </Alert>
      )}

      {/* Notifications Section */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🔔 Notifications
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
              label="Enable Notifications"
            />

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="sound-select-label">
                  Notification Sound
                </InputLabel>
                <Select
                  labelId="sound-select-label"
                  value={settings.sound}
                  onChange={(e) =>
                    handleSoundChange(e.target.value as NotificationSound)
                  }
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
                <InputLabel id="advance-days-label">
                  Send Notifications
                </InputLabel>
                <Select
                  labelId="advance-days-label"
                  value={settings.advanceDays}
                  onChange={(e) =>
                    handleAdvanceDaysChange(Number(e.target.value))
                  }
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
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🎨 Appearance
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={themeSettings.mode === "dark"}
                  onChange={toggleMode}
                />
              }
              label="Dark Mode"
            />
            <IconButton onClick={toggleMode} color="primary">
              {themeSettings.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Wishes Section */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🎂 Birthday Wishes
          </Typography>
          <WishLibrary />
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card elevation={3} sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🗂️ Data Management
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleResetClick}
            sx={{
              mt: 2,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Reset All Settings
          </Button>
        </CardContent>
      </Card>
    </Paper>
  );
};