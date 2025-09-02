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
          p: 3,
          borderRadius: 4,
          backgroundColor: 'background.paper',
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
          bottom: 76, // Above footer
          right: 24,
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
