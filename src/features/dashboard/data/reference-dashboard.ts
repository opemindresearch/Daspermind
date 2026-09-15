import type { DashboardData, DashboardState } from '../model/dashboard.schema';

/** Only values supplied in the approved dashboard reference. */
export const referenceDashboard: DashboardData = {
  greeting: 'Welcome in, Nixtio',
  company: {
    employees: 78,
    hirings: 56,
    projects: 203,
    allocation: { interviews: 15, hired: 15, projectTime: 60, output: 10 },
  },
  employee: {
    id: 'lora-piterson',
    name: 'Lora Piterson',
    role: 'UX/UI Designer',
    compensationLabel: '$1,200',
    device: { name: 'MacBook Air', version: 'Version M1' },
  },
  progress: { weeklyHours: 6.1, highlightedDay: 'Friday', highlightedDuration: '5h 23m' },
  onboarding: {
    percent: 18,
    totalTasks: 8,
    segments: [30, 25, 0],
    tasks: [
      { id: 'interview', title: 'Interview', dateLabel: 'Sep 13, 08:30', kind: 'interview' },
      { id: 'meeting', title: 'Team Meeting', dateLabel: 'Sep 13, 10:30', kind: 'meeting' },
      { id: 'update', title: 'Project Update', dateLabel: 'Sep 13, 13:00', kind: 'update' },
      { id: 'goals', title: 'Discuss Q3 Goals', dateLabel: 'Sep 13, 14:45', kind: 'goals' },
      { id: 'policy', title: 'HR Policy Review', dateLabel: 'Sep 13, 16:30', kind: 'policy' },
    ],
  },
  calendar: {
    year: 2024,
    month: 8,
    // Preserve the artwork's labels; its weekday/date combination is not a real September week.
    referenceDays: [
      { day: 'Mon', date: 22 },
      { day: 'Tue', date: 23 },
      { day: 'Wed', date: 24 },
      { day: 'Thu', date: 25 },
      { day: 'Fri', date: 26 },
      { day: 'Sat', date: 27 },
    ],
    events: [
      {
        id: 'team-event',
        title: 'Weekly Team Sync',
        subtitle: 'Discuss progress on projects',
        timeLabel: '8:00 am',
        kind: 'team',
        avatars: ['one', 'two', 'three'],
      },
      {
        id: 'onboarding-event',
        title: 'Onboarding Session',
        subtitle: 'Introduction for new hires',
        timeLabel: '10:00 am',
        kind: 'onboarding',
        avatars: ['four', 'five'],
      },
    ],
  },
};
export function createInitialState(): DashboardState {
  return {
    schemaVersion: 1,
    completedTaskIds: ['interview', 'meeting'],
    elapsedSeconds: 155,
    preferences: { rememberChanges: true, reduceMotion: false },
  };
}
