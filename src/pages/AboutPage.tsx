import { Typography, Paper, Link } from '@mui/material';

export const AboutPage = () => {
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
        About Remind Candles
      </Typography>
      <Typography variant="body1" paragraph>
        Remind Candles is a thoughtful birthday reminder application that helps you keep track of your loved ones' special days.
      </Typography>
      <Typography variant="body1" paragraph>
        Never miss a birthday again with our intuitive interface and timely notifications.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Created with ❤️ by{' '}
        <Link
          href="https://github.com/himanshubokde21"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          Himanshu Bokde
        </Link>
      </Typography>
    </Paper>
  );
};
