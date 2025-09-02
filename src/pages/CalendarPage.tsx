import { Typography, Paper } from '@mui/material';

export const CalendarPage = () => {
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
        Birthday Calendar
      </Typography>
      <Typography variant="body1">
        View all birthdays in a calendar format...
      </Typography>
    </Paper>
  );
};
