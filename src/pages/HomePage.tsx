import { Typography, Paper, Box } from "@mui/material";

export const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // centers horizontally
        alignItems: "flex-start", // keep near top
        minHeight: "100vh",
        px: 2,
      }}
    >
      <Paper
        elevation={6} // subtle shadow
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 6,
          background: "linear-gradient(135deg, #f8bbd0 0%, #e1bee7 100%)", // soft pink-purple gradient
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          color: "white", // text contrast
          mt: 6, // spacing from top
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textShadow: "1px 1px 4px rgba(0,0,0,0.2)", // subtle glow
          }}
        >
          🎂 Welcome to Remind Candles 🎉
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            opacity: 0.9,
          }}
        >
          Never miss a birthday again!  
          The next birthday celebration is coming up...
        </Typography>
      </Paper>
    </Box>
  );
};
