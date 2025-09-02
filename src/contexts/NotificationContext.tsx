import { createContext, useContext, useEffect, useState } from 'react';
import { NotificationService } from '../services/NotificationService';
import type { BirthdayPerson } from '../services/NotificationService';

import type { NotificationSettings } from '../types/notification';

interface NotificationContextType {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (person: BirthdayPerson) => Promise<void>;
  scheduleBirthdayChecks: (birthdays: BirthdayPerson[]) => void;
  settings: NotificationSettings;
  updateSettings: (settings: NotificationSettings) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationService] = useState(() => NotificationService.getInstance());
  const [hasPermission, setHasPermission] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(() => 
    notificationService.getSettings()
  );

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await notificationService.requestPermission();
      setHasPermission(permission);
    };
    checkPermission();
  }, [notificationService]);

  const value = {
    hasPermission,
    requestPermission: async () => {
      const permission = await notificationService.requestPermission();
      setHasPermission(permission);
      return permission;
    },
    sendNotification: (person: BirthdayPerson) => notificationService.sendBirthdayNotification(person),
    scheduleBirthdayChecks: (birthdays: BirthdayPerson[]) => notificationService.scheduleDailyCheck(birthdays),
    settings,
    updateSettings: (newSettings: NotificationSettings) => {
      notificationService.updateSettings(newSettings);
      setSettings(newSettings);
    }
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
