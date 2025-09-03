import { useState } from 'react';
import { Typography, Paper, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddBirthdayForm } from '../components/AddBirthdayForm';
import { useBirthdays } from '../contexts/BirthdayContext';

export const ListPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { birthdays } = useBirthdays();

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          backgroundColor: 'background.paper',
          width: '100%',
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Birthday List
        </Typography>
        <Typography variant="body1" gutterBottom>
          {birthdays.length === 0 
            ? "No birthdays added yet. Click the + button to add your first birthday!"
            : `${birthdays.length} birthdays saved`}
        </Typography>
      </Paper>

      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 76 }, // Adjusted for mobile
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          aria-label="add birthday"
          onClick={handleOpenAddDialog}
          sx={{
            boxShadow: 3,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <AddBirthdayForm
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
      />
    </>
  );
};
