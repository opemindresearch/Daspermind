import type { DashboardData, DashboardState } from '../model/dashboard.schema';

/** Illustrative teacher profile. No values here are official records or admission results. */
export const referenceDashboard: DashboardData = {
  greeting: 'Hola, maestro Luis',
  company: {
    employees: 8,
    hirings: 2,
    projects: 3,
    allocation: { interviews: 100, hired: 80, projectTime: 45, output: 0 },
  },
  employee: {
    id: 'docente-demo',
    name: 'Luis Herrera',
    role: 'Primaria · Perfil de ejemplo',
    compensationLabel: 'AB-DEMO',
    device: { name: 'Educación primaria', version: 'Licenciatura · Titulado' },
  },
  progress: { weeklyHours: 6.1, highlightedDay: 'Viernes', highlightedDuration: '1 h 40m' },
  onboarding: {
    percent: 40,
    totalTasks: 5,
    // Independent example progress values for profile, documents and preparation.
    segments: [80, 75, 45],
    tasks: [
      {
        id: 'convocatoria',
        title: 'Revisar convocatoria',
        dateLabel: 'Consulta de referencia',
        kind: 'interview',
      },
      {
        id: 'expediente',
        title: 'Organizar expediente',
        dateLabel: 'Documentos de ejemplo',
        kind: 'meeting',
      },
      {
        id: 'curso',
        title: 'Revisar curso NEM',
        dateLabel: 'Habilidades docentes',
        kind: 'update',
      },
      {
        id: 'guia',
        title: 'Repasar guía de estudio',
        dateLabel: 'Conocimientos y aptitudes',
        kind: 'goals',
      },
      {
        id: 'avisos',
        title: 'Consultar avisos',
        dateLabel: 'Portal oficial USICAMM',
        kind: 'policy',
      },
    ],
  },
  calendar: {
    year: 2026,
    month: 8,
    // Personal example agenda, not the official admission calendar.
    referenceDays: [
      { day: 'Lun', date: 14 },
      { day: 'Mar', date: 15 },
      { day: 'Mié', date: 16 },
      { day: 'Jue', date: 17 },
      { day: 'Vie', date: 18 },
      { day: 'Sáb', date: 19 },
    ],
    events: [
      {
        id: 'team-event',
        title: 'Repaso de la guía',
        subtitle: 'Agenda personal · Ejemplo',
        timeLabel: '15 de septiembre · 8:00 h',
        kind: 'team',
        avatars: ['one', 'two', 'three'],
      },
      {
        id: 'onboarding-event',
        title: 'Revisión de documentos',
        subtitle: 'Recordatorio · Ejemplo',
        timeLabel: '17 de septiembre · 10:00 h',
        kind: 'onboarding',
        avatars: ['four', 'five'],
      },
    ],
  },
};
export function createInitialState(): DashboardState {
  return {
    schemaVersion: 1,
    completedTaskIds: ['convocatoria', 'expediente'],
    elapsedSeconds: 155,
    preferences: { rememberChanges: true, reduceMotion: false },
  };
}
