import { Typography, Paper } from '@mui/material';

export const HomePage = () => {
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
        Welcome to Remind Candles
      </Typography>
      <Typography variant="body1">
        Never miss a birthday again! The next birthday celebration is coming up...
      </Typography>
    </Paper>
  );
};
