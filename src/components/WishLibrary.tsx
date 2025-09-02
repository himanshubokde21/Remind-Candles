import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useWishing } from '../contexts/WishingContext';
import type { WishTemplate } from '../services/WishLibraryService';

interface EditWishDialogProps {
  open: boolean;
  onClose: () => void;
  wish?: WishTemplate;
  onSave: (wish: Pick<WishTemplate, 'name' | 'content'>) => void;
}

const EditWishDialog = ({ open, onClose, wish, onSave }: EditWishDialogProps) => {
  const [name, setName] = useState(wish?.name || '');
  const [content, setContent] = useState(wish?.content || '');

  const handleSave = () => {
    if (name.trim() && content.trim()) {
      onSave({ name, content });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{wish ? 'Edit Wish' : 'Add New Wish'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Wish Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Wish Content"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const WishLibrary = () => {
  const { wishes, addWish, updateWish, deleteWish, setDefaultWish } = useWishing();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<WishTemplate | undefined>();

  const handleAddClick = () => {
    setEditingWish(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (wish: WishTemplate) => {
    setEditingWish(wish);
    setDialogOpen(true);
  };

  const handleSave = (wishData: Pick<WishTemplate, 'name' | 'content'>) => {
    if (editingWish) {
      updateWish(editingWish.id, wishData);
    } else {
      addWish(wishData);
    }
  };

  const handleDeleteClick = (wish: WishTemplate) => {
    if (!wish.isDefault) {
      deleteWish(wish.id);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Birthday Wishes Library</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={handleAddClick}
          >
            Add Wish
          </Button>
        </Box>

        <List>
          {wishes.map((wish) => (
            <ListItem
              key={wish.id}
              divider
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="set default"
                    onClick={() => setDefaultWish(wish.id)}
                    sx={{ mr: 1 }}
                  >
                    {wish.isDefault ? (
                      <StarIcon color="primary" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditClick(wish)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(wish)}
                    disabled={wish.isDefault}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={wish.name}
                secondary={wish.content}
                secondaryTypographyProps={{
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

        <EditWishDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          wish={editingWish}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
};
