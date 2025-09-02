export type NotificationSound = 'soft-chime' | 'birthday-tune' | 'loud-alert';

export interface NotificationSettings {
  sound: NotificationSound;
  enabled: boolean;
  advanceDays: 0 | 1 | 3;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  sound: 'birthday-tune',
  enabled: false,
  advanceDays: 0
};
