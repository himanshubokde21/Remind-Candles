import { useState } from 'react';
import { 
  Box,
  IconButton,
  Typography,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Cake as CakeIcon,
} from '@mui/icons-material';
import type { Birthday } from '../services/BirthdayService';
import { useBirthdays } from '../contexts/BirthdayContext';

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(1),
}));

interface DayProps {
  day: number;
  isCurrentMonth: boolean;
  hasBirthday: boolean;
  onClick: () => void;
}

const CalendarDay = ({ day, isCurrentMonth, hasBirthday, onClick }: DayProps) => {
  const theme = useTheme();
  
  return (
    <Button
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: isCurrentMonth ? 'background.paper' : 'action.hover',
        color: isCurrentMonth ? 'text.primary' : 'text.disabled',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    >
      <Typography variant="body2">
        {day}
      </Typography>
      {hasBirthday && (
        <CakeIcon
          sx={{
            color: theme.palette.primary.main,
            fontSize: '1rem',
            position: 'absolute',
            bottom: 4,
            right: 4,
          }}
        />
      )}
    </Button>
  );
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { birthdays } = useBirthdays();

  // Create a map of dates to birthdays for quick lookup
  const birthdayMap = new Map<string, Birthday[]>();
  birthdays.forEach(birthday => {
    const date = new Date(birthday.birthDate);
    const key = `${date.getMonth()}-${date.getDate()}`;
    if (!birthdayMap.has(key)) {
      birthdayMap.set(key, []);
    }
    birthdayMap.get(key)?.push(birthday);
  });

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasBirthdayOnDate = (day: number, month: number): boolean => {
    return birthdayMap.has(`${month}-${day}`);
  };

  const getBirthdaysOnDate = (day: number, month: number): Birthday[] => {
    return birthdayMap.get(`${month}-${day}`) || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
  };

  const handleYearChange = (delta: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear() + delta, prevDate.getMonth()));
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const currentMonth = currentDate.getMonth();

    // Previous month's days
    const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentMonth - 1));
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <CalendarDay
          key={`prev-${day}`}
          day={day}
          isCurrentMonth={false}
          hasBirthday={hasBirthdayOnDate(day, currentMonth - 1)}
          onClick={() => {}}
        />
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <CalendarDay
          key={`current-${day}`}
          day={day}
          isCurrentMonth={true}
          hasBirthday={hasBirthdayOnDate(day, currentMonth)}
          onClick={() => {
            setSelectedDate(new Date(currentDate.getFullYear(), currentMonth, day));
          }}
        />
      );
    }

    // Next month's days
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <CalendarDay
          key={`next-${day}`}
          day={day}
          isCurrentMonth={false}
          hasBirthday={hasBirthdayOnDate(day, currentMonth + 1)}
          onClick={() => {}}
        />
      );
    }

    return days;
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => handleYearChange(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">
            {currentDate.getFullYear()}
          </Typography>
          <IconButton onClick={() => handleYearChange(1)}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 100, textAlign: 'center' }}>
            {MONTHS[currentDate.getMonth()]}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ mb: 2 }}>
        <GridContainer>
          {DAYS_OF_WEEK.map(day => (
            <Typography
              key={day}
              variant="subtitle2"
              align="center"
              sx={{
                py: 1,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 1,
              }}
            >
              {day}
            </Typography>
          ))}
        </GridContainer>
        <GridContainer>
          {renderCalendarDays()}
        </GridContainer>
      </Box>

      {/* Birthday Dialog */}
      <Dialog
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {selectedDate && (
            `Birthdays on ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`
          )}
        </DialogTitle>
        <DialogContent>
          {selectedDate && (
            <List>
              {getBirthdaysOnDate(selectedDate.getDate(), selectedDate.getMonth()).map(birthday => (
                <ListItem key={birthday.id}>
                  <ListItemText
                    primary={birthday.name}
                    secondary={`Born in ${new Date(birthday.birthDate).getFullYear()}`}
                  />
                </ListItem>
              ))}
              {getBirthdaysOnDate(selectedDate.getDate(), selectedDate.getMonth()).length === 0 && (
                <ListItem>
                  <ListItemText primary="No birthdays on this date" />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};


