/**
 * DEMO DATA FILE - FLAG FOR DELETION
 * TODO: Replace with real database data
 * This file contains mock data for dashboard components
 * Delete this file once real data integration is complete
 */

// ============================================
// DEMO DATA - REMOVE WHEN CONNECTING TO DATABASE
// ============================================

export const DEMO_STATS = {
  totalScouts: 248,
  activeTeams: 12,
} as const;

export const DEMO_UPCOMING_EVENTS = [
  { id: '1', title: 'Outdoor survival workshop', date: 'Mar 18', time: '11:00 am' },
  { id: '2', title: 'Community service day', date: 'Mar 20', time: '6:00 am' },
  { id: '3', title: 'Leadership camp', date: 'Mar 24', time: '6:00 pm' },
  { id: '4', title: 'Training event', date: 'Mar 23', time: '9:00 pm' },
] as const;

export const DEMO_RECENT_ACTIVITY = [
  {
    id: '1',
    avatar: '/avatars/scout1.jpg',
    user: 'Scout',
    action: 'Updated a new continue. Outdoor survival workshop.',
    time: '18 hours ago',
  },
  {
    id: '2',
    avatar: '/avatars/scout2.jpg',
    user: 'Scout',
    action: 'Updated on outdoor workshop.',
    time: '16 hours ago',
  },
  {
    id: '3',
    avatar: '/avatars/scout3.jpg',
    user: 'Scout',
    action: 'Updated on scout updates.',
    time: '18 hours ago',
  },
  {
    id: '4',
    avatar: '/avatars/scout4.jpg',
    user: 'Scout',
    action: 'Inadured moinery scout updates.',
    time: '13 hours ago',
  },
  {
    id: '5',
    avatar: '/avatars/camp.jpg',
    user: 'Leadership Camp',
    action: 'updated.',
    time: '24 hours ago',
  },
] as const;

export const DEMO_ATTENDANCE_TREND = [
  { month: 'Jan', value: 35 },
  { month: 'Feb', value: 42 },
  { month: 'Mar', value: 38 },
  { month: 'Aug', value: 55 },
  { month: 'Sep', value: 62 },
  { month: 'Oct', value: 70 },
  { month: 'Nov', value: 78 },
  { month: 'Dec', value: 85 },
] as const;

export const DEMO_BADGE_PROGRESS = [
  { badge: '1', count: 95 },
  { badge: '2', count: 60 },
  { badge: '3', count: 75 },
  { badge: '4', count: 105 },
  { badge: '5', count: 140 },
  { badge: '6', count: 110 },
] as const;

export const DEMO_SYSTEM_MESSAGES = [
  {
    id: '1',
    message: 'System Message has lited that ouelicneally.',
  },
] as const;

// Settings demo data - using regular types for mutability
export const DEMO_USER_PROFILE: {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
} = {
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '+966 50 123 4567',
  role: 'Administrator',
  avatar: '/avatars/admin.jpg',
};

export const DEMO_NOTIFICATION_SETTINGS: {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklySummaries: boolean;
  activityAlerts: boolean;
  eventReminders: boolean;
  systemUpdates: boolean;
} = {
  emailNotifications: true,
  pushNotifications: false,
  weeklySummaries: true,
  activityAlerts: false,
  eventReminders: true,
  systemUpdates: true,
};

export const DEMO_APPEARANCE_SETTINGS: {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  compactMode: boolean;
} = {
  theme: 'light',
  language: 'en',
  compactMode: false,
};

export const DEMO_SECURITY_SETTINGS: {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
} = {
  twoFactorEnabled: false,
  lastPasswordChange: '2024-01-15',
  activeSessions: 2,
};
