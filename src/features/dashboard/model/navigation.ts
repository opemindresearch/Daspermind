export const navigationItems = [
  'Dashboard',
  'People',
  'Hiring',
  'Devices',
  'Apps',
  'Salary',
  'Calendar',
  'Reviews',
] as const;
export type NavigationItem = (typeof navigationItems)[number];
export type DialogKind =
  | Exclude<NavigationItem, 'Dashboard' | 'Calendar'>
  | 'profile'
  | 'device'
  | 'salary'
  | 'projects'
  | 'progress'
  | 'timer'
  | 'team-event'
  | 'onboarding-event'
  | 'notifications'
  | 'settings';
export type SectionId =
  | 'main'
  | 'employee-details'
  | 'onboarding-panel'
  | 'progress-panel'
  | 'calendar-panel'
  | 'timer-panel';
