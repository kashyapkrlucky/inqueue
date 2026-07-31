export interface Settings {
  _id: string;
  user: string;
  timezone: string;
  notificationTime: string;
  notificationEnabled: boolean;
  nextNotificationAt: Date;
  lastNotificationAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingsCreateInput {
  timezone: string;
  notificationTime: string;
  notificationEnabled: boolean;
}

export interface SettingsUpdateInput {
  timezone?: string;
  notificationTime?: string;
  notificationEnabled?: boolean;
}
