import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useDashboard, type DashboardController } from '@/features/dashboard/hooks/useDashboard';
import { useCalendar } from '@/features/dashboard/hooks/useCalendar';
import { useWorkTimer } from '@/features/dashboard/hooks/useWorkTimer';
import { Overview } from '@/features/dashboard/components/Overview';
import { ProfileCard } from '@/features/dashboard/components/ProfileCard';
import { ProgressCard } from '@/features/dashboard/components/ProgressCard';
import { TimeTrackerCard } from '@/features/dashboard/components/TimeTrackerCard';
import { OnboardingCard } from '@/features/dashboard/components/OnboardingCard';
import {
  EmployeeDetailsCard,
  type EmployeeDetailSection,
} from '@/features/dashboard/components/EmployeeDetailsCard';
import { CalendarCard } from '@/features/dashboard/components/CalendarCard';
import { DashboardDialog } from '@/features/dashboard/components/DashboardDialog';
import type {
  DashboardSnapshot,
  DashboardPreferences,
  OnboardingTask,
} from '@/features/dashboard/model/dashboard.schema';
import type { DialogKind, NavigationItem, SectionId } from '@/features/dashboard/model/navigation';

function DashboardWorkspace({
  snapshot,
  controller,
}: {
  snapshot: DashboardSnapshot;
  controller: DashboardController;
}) {
  const { data, state } = snapshot;
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const [expanded, setExpanded] = useState<EmployeeDetailSection>('devices');
  const toast = useToast();
  const calendar = useCalendar(data.calendar);
  const timer = useWorkTimer(state.elapsedSeconds, controller.saveElapsed, toast.notify);
  const pendingTasks = data.onboarding.tasks.filter(
    (task) => !state.completedTaskIds.includes(task.id),
  ).length;
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', state.preferences.reduceMotion);
    return () => document.documentElement.classList.remove('reduce-motion');
  }, [state.preferences.reduceMotion]);

  function jumpTo(section: SectionId) {
    setDialog(null);
    if (section === 'employee-details') setExpanded('devices');
    requestAnimationFrame(() => {
      const target = document.getElementById(section);
      if (!target) return;
      target.scrollIntoView({
        block: 'center',
        behavior:
          state.preferences.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
      });
      target.querySelector<HTMLElement>('button,summary')?.focus({ preventScroll: true });
    });
  }
  function navigate(item: NavigationItem) {
    if (item === 'Dashboard') jumpTo('main');
    else if (item === 'Calendar') jumpTo('calendar-panel');
    else setDialog(item);
  }
  async function toggleTask(task: OnboardingTask) {
    const saved = await controller.toggleTask(task.id);
    if (saved)
      toast.notify(
        `${task.title} ${saved.state.completedTaskIds.includes(task.id) ? 'completed' : 'reopened'}`,
      );
  }
  async function savePreferences(preferences: DashboardPreferences) {
    if (await controller.savePreferences(preferences)) {
      setDialog(null);
      toast.notify('Preferences saved');
    }
  }
  async function restore() {
    const restored = await controller.restore();
    if (restored) {
      timer.restore(restored.state.elapsedSeconds);
      calendar.reset();
      setExpanded('devices');
      setDialog(null);
      toast.notify('Dashboard restored');
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>
      <div className="dashboard-shell">
        <DashboardHeader
          active={dialog}
          employeeName={data.employee.name}
          pendingTasks={pendingTasks}
          onNavigate={navigate}
          onOpen={setDialog}
        />
        <main id="main" tabIndex={-1}>
          <h1>{data.greeting}</h1>
          {controller.saveError ? (
            <p className="save-error" role="alert">
              {controller.saveError}
            </p>
          ) : null}
          <Overview company={data.company} onOpen={setDialog} />
          <div className="dashboard-grid">
            <ProfileCard employee={data.employee} onCompensation={() => setDialog('salary')} />
            <ProgressCard progress={data.progress} onDetails={() => setDialog('progress')} />
            <TimeTrackerCard timer={timer} onDetails={() => setDialog('timer')} />
            <OnboardingCard
              onboarding={data.onboarding}
              completedIds={state.completedTaskIds}
              saving={controller.isSaving}
              onToggle={(task) => void toggleTask(task)}
            />
            <EmployeeDetailsCard
              employee={data.employee}
              expanded={expanded}
              onExpand={setExpanded}
              onDevice={() => setDialog('device')}
            />
            <CalendarCard calendar={calendar} onOpen={setDialog} />
          </div>
        </main>
      </div>
      <DashboardDialog
        kind={dialog}
        snapshot={snapshot}
        timer={timer}
        saving={controller.isSaving}
        saveError={controller.saveError}
        onClose={() => setDialog(null)}
        onJump={jumpTo}
        onSavePreferences={savePreferences}
        onRestore={restore}
      />
      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
export function DashboardPage() {
  const controller = useDashboard();
  if (controller.status === 'error')
    return (
      <main className="dashboard-shell app-status" role="alert">
        <h1>Dashboard unavailable</h1>
        <p>We couldn’t load your workspace. Please try again.</p>
        <button className="dialog-primary" onClick={controller.retry}>
          Try again
        </button>
      </main>
    );
  if (!controller.snapshot)
    return (
      <main className="dashboard-shell app-status" aria-busy="true">
        <span className="loading-dot" />
        <p role="status">Loading your workspace…</p>
      </main>
    );
  return <DashboardWorkspace snapshot={controller.snapshot} controller={controller} />;
}
