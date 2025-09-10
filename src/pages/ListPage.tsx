import { useState } from "react";
import {
  Typography,
  Paper,
  Fab,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddBirthdayForm } from "../components/AddBirthdayForm";
import { useBirthdays } from "../contexts/BirthdayContext";

// helper: calculate days remaining
const getDaysRemaining = (dateString: string): number => {
  if (!dateString) return 0;

  const today = new Date();
  const birthday = new Date(dateString);

  if (isNaN(birthday.getTime())) return 0; // invalid date safeguard

  birthday.setFullYear(today.getFullYear());
  if (birthday < today) {
    birthday.setFullYear(today.getFullYear() + 1);
  }

  const diff = birthday.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};


export interface Birthday {
  id: string;
  name: string;
  date?: string; // made optional in case context doesn’t always provide it
}

export const ListPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { birthdays, updateBirthday, deleteBirthday } = useBirthdays() as {
  birthdays: Birthday[];
  updateBirthday: (id: string, data: Partial<Birthday>) => void;
  deleteBirthday: (id: string) => void;
};

  const handleOpenAddDialog = () => setIsAddDialogOpen(true);
  const handleCloseAddDialog = () => setIsAddDialogOpen(false);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          backgroundColor: "background.paper",
          width: "100%",
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Birthday List
        </Typography>

        {birthdays.length === 0 ? (
          <Typography variant="body1">
            No birthdays added yet. Click the + button to add your first birthday!
          </Typography>
        ) : (
          <List>
            {birthdays.map((b) => (
              <ListItem
                key={b.id}
                divider
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() =>
                        updateBirthday(b.id, { name: "Updated Name" })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => deleteBirthday(b.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={b.name}
                  secondary={`In ${getDaysRemaining(b.date || "")} days (${b.date || "N/A"})`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 76 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          aria-label="add birthday"
          onClick={handleOpenAddDialog}
          sx={{ boxShadow: 3 }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <AddBirthdayForm open={isAddDialogOpen} onClose={handleCloseAddDialog} />
    </>
  );
};
