import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useBirthdays } from '../contexts/BirthdayContext';
import { useWishing } from '../contexts/WishingContext';

const phoneRegExp = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  birthDate: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future')
    .nullable(),
  email: Yup.string()
    .email('Invalid email address')
    .trim()
    .test('emailOrPhone', 'At least one contact method is required', function(value) {
      // @ts-ignore - parent is available in test context
      const { phone } = this.parent;
      if (!value && !phone) return false;
      return true;
    }),
  phone: Yup.string()
    .matches(phoneRegExp, 'Invalid phone number format')
    .trim()
    .test('phoneOrEmail', 'At least one contact method is required', function(value) {
      // @ts-ignore - parent is available in test context
      const { email } = this.parent;
      if (!value && !email) return false;
      return true;
    }),
  customWish: Yup.string()
    .max(500, 'Custom wish must be less than 500 characters')
    .trim(),
  wishId: Yup.string()
    .required('Please select a birthday wish')
});

interface AddBirthdayFormProps {
  open: boolean;
  onClose: () => void;
}

export const AddBirthdayForm = ({ open, onClose }: AddBirthdayFormProps) => {
  const { addBirthday } = useBirthdays();
  const { wishes, defaultWish } = useWishing();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      birthDate: null as Date | null,
      email: '',
      phone: '',
      wishId: defaultWish.id,
      customWish: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!values.birthDate) {
          throw new Error('Birth date is required');
        }

        const selectedWish = wishes.find(w => w.id === values.wishId);
        await addBirthday({
          name: values.name,
          birthDate: values.birthDate.toISOString(),
          email: values.email || undefined,
          phone: values.phone || undefined,
          customWish: values.customWish || (selectedWish && selectedWish.content) || undefined,
        });

        formik.resetForm();
        onClose();
      } catch (error) {
        setSubmitError('Failed to add birthday. Please try again.');
        console.error('Error adding birthday:', error);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Add New Birthday</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {submitError && (
              <Alert severity="error" onClose={() => setSubmitError(null)}>
                {submitError}
              </Alert>
            )}

            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={formik.values.birthDate}
                onChange={(value) => formik.setFieldValue('birthDate', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.birthDate && Boolean(formik.errors.birthDate),
                    helperText: formik.touched.birthDate && formik.errors.birthDate as string,
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email (optional if phone provided)"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="WhatsApp/Phone (optional if email provided)"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <FormControl
              fullWidth
              error={formik.touched.wishId && Boolean(formik.errors.wishId)}
            >
              <InputLabel id="wish-select-label">Birthday Wish</InputLabel>
              <Select
                labelId="wish-select-label"
                id="wishId"
                name="wishId"
                value={formik.values.wishId}
                onChange={formik.handleChange}
                label="Birthday Wish"
              >
                {wishes.map(wish => (
                  <MenuItem key={wish.id} value={wish.id}>
                    {wish.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.wishId && formik.errors.wishId && (
                <FormHelperText>{formik.errors.wishId as string}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="customWish"
              name="customWish"
              label="Custom Birthday Wish (optional, overrides selected wish)"
              multiline
              rows={3}
              value={formik.values.customWish}
              onChange={formik.handleChange}
              error={formik.touched.customWish && Boolean(formik.errors.customWish)}
              helperText={formik.touched.customWish && formik.errors.customWish}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Birthday
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
