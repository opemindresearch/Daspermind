import { useState } from 'react';
import type { DashboardData } from '../model/dashboard.schema';
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function useCalendar(calendar: DashboardData['calendar']) {
  const [offset, setOffset] = useState(0);
  const date = new Date(calendar.year, calendar.month + offset, 1);
  const previous = new Date(calendar.year, calendar.month + offset - 1, 1);
  const next = new Date(calendar.year, calendar.month + offset + 1, 1);
  const firstMonday = 1 + ((8 - date.getDay()) % 7);
  return {
    offset,
    title: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
    previousLabel: monthNames[previous.getMonth()],
    nextLabel: monthNames[next.getMonth()],
    previousYear: previous.getFullYear(),
    nextYear: next.getFullYear(),
    days:
      offset === 0
        ? calendar.referenceDays
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => ({
            day,
            date: firstMonday + index,
          })),
    events: offset === 0 ? calendar.events : [],
    referenceMonth: monthNames[calendar.month],
    previous: () => setOffset((value) => value - 1),
    next: () => setOffset((value) => value + 1),
    reset: () => setOffset(0),
  };
}
export type CalendarController = ReturnType<typeof useCalendar>;
