import { z } from 'zod';

const percentage = z.number().min(0).max(100);
const count = z.number().int().nonnegative();
export const preferencesSchema = z.object({
  rememberChanges: z.boolean(),
  reduceMotion: z.boolean(),
});
export const dashboardStateSchema = z.object({
  schemaVersion: z.literal(1),
  completedTaskIds: z
    .array(z.string())
    .refine((ids) => new Set(ids).size === ids.length, 'Duplicate task ids'),
  elapsedSeconds: count,
  preferences: preferencesSchema,
});
export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  dateLabel: z.string(),
  kind: z.enum(['interview', 'meeting', 'update', 'goals', 'policy']),
});
export const calendarEventSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  subtitle: z.string(),
  timeLabel: z.string(),
  kind: z.enum(['team', 'onboarding']),
  avatars: z.array(z.enum(['one', 'two', 'three', 'four', 'five'])),
});
export const dashboardDataSchema = z.object({
  greeting: z.string(),
  company: z.object({
    employees: count,
    hirings: count,
    projects: count,
    allocation: z.object({
      interviews: percentage,
      hired: percentage,
      projectTime: percentage,
      output: percentage,
    }),
  }),
  employee: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    compensationLabel: z.string(),
    device: z.object({ name: z.string(), version: z.string() }),
  }),
  progress: z.object({
    weeklyHours: z.number().nonnegative(),
    highlightedDay: z.string(),
    highlightedDuration: z.string(),
  }),
  onboarding: z.object({
    percent: percentage,
    totalTasks: count,
    segments: z.tuple([percentage, percentage, percentage]),
    tasks: z.array(taskSchema),
  }),
  calendar: z.object({
    year: z.number().int().min(1900).max(9999),
    month: z.number().int().min(0).max(11),
    referenceDays: z
      .array(z.object({ day: z.string(), date: z.number().int().min(1).max(31) }))
      .length(6),
    events: z.array(calendarEventSchema),
  }),
});
export const dashboardSnapshotSchema = z
  .object({ data: dashboardDataSchema, state: dashboardStateSchema })
  .superRefine((snapshot, ctx) => {
    const ids = new Set(snapshot.data.onboarding.tasks.map((task) => task.id));
    if (ids.size !== snapshot.data.onboarding.tasks.length)
      ctx.addIssue({
        code: 'custom',
        message: 'Duplicate tasks',
        path: ['data', 'onboarding', 'tasks'],
      });
    if (snapshot.data.onboarding.totalTasks < ids.size)
      ctx.addIssue({
        code: 'custom',
        message: 'Task total cannot be less than visible tasks',
        path: ['data', 'onboarding', 'totalTasks'],
      });
    if (snapshot.state.completedTaskIds.some((id) => !ids.has(id)))
      ctx.addIssue({
        code: 'custom',
        message: 'Unknown completed task',
        path: ['state', 'completedTaskIds'],
      });
  });

export type DashboardData = z.infer<typeof dashboardDataSchema>;
export type DashboardState = z.infer<typeof dashboardStateSchema>;
export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;
export type DashboardPreferences = z.infer<typeof preferencesSchema>;
export type OnboardingTask = z.infer<typeof taskSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;
