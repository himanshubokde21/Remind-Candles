import { Typography, Paper } from '@mui/material';
import { BirthdayCalendar } from '../components/BirthdayCalendar';

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
      <BirthdayCalendar />
    </Paper>
  );
};
