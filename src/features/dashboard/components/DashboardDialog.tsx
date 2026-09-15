import { useState, type ReactNode, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import type { DashboardPreferences, DashboardSnapshot } from '../model/dashboard.schema';
import type { DialogKind, SectionId } from '../model/navigation';
import type { WorkTimer } from '../hooks/useWorkTimer';

type Props = {
  kind: DialogKind | null;
  snapshot: DashboardSnapshot;
  timer: WorkTimer;
  saving: boolean;
  saveError: string | null;
  onClose: () => void;
  onJump: (section: SectionId) => void;
  onSavePreferences: (preferences: DashboardPreferences) => Promise<void>;
  onRestore: () => Promise<void>;
};
function DetailList({ items }: { items: [string, string][] }) {
  return (
    <div className="dialog-list">
      {items.map(([label, value]) => (
        <div key={label}>
          <strong>{label}</strong>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
function JumpButton({
  section,
  children,
  onJump,
}: {
  section: SectionId;
  children: ReactNode;
  onJump: Props['onJump'];
}) {
  return (
    <button type="button" className="dialog-primary" onClick={() => onJump(section)}>
      {children}
    </button>
  );
}
function SettingsForm({
  preferences,
  saving,
  error,
  onSave,
  onRestore,
}: {
  preferences: DashboardPreferences;
  saving: boolean;
  error: string | null;
  onSave: Props['onSavePreferences'];
  onRestore: Props['onRestore'];
}) {
  const [draft, setDraft] = useState(preferences);
  function submit(event: FormEvent) {
    event.preventDefault();
    void onSave(draft);
  }
  return (
    <form onSubmit={submit}>
      <label className="setting-row">
        <span>Remember my changes</span>
        <input
          type="checkbox"
          id="setting-remember"
          checked={draft.rememberChanges}
          onChange={(event) =>
            setDraft((previous) => ({ ...previous, rememberChanges: event.target.checked }))
          }
        />
      </label>
      <label className="setting-row">
        <span>Reduce motion</span>
        <input
          type="checkbox"
          id="setting-motion"
          checked={draft.reduceMotion}
          onChange={(event) =>
            setDraft((previous) => ({ ...previous, reduceMotion: event.target.checked }))
          }
        />
      </label>
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" className="dialog-primary" id="save-settings" disabled={saving}>
        {saving ? 'Saving…' : 'Save preferences'}
      </button>
      <br />
      <button
        type="button"
        className="dialog-secondary"
        id="restore-dashboard"
        disabled={saving}
        onClick={() => void onRestore()}
      >
        Restore dashboard
      </button>
    </form>
  );
}

function getDialogView(props: Props): { title: string; content: ReactNode } {
  const {
    kind,
    snapshot: { data, state },
    onJump,
    timer,
  } = props;
  const { employee, company, onboarding, progress } = data;
  switch (kind) {
    case 'profile':
    case 'People':
      return {
        title: kind === 'People' ? 'People' : employee.name,
        content: (
          <>
            {kind === 'People' ? (
              <>
                <div className="dialog-metric">{company.employees}</div>
                <p>Employe</p>
              </>
            ) : (
              <p>{employee.role}</p>
            )}
            <DetailList
              items={[
                [employee.name, employee.role],
                ['Compensation', employee.compensationLabel],
                [
                  'Device',
                  `${employee.device.name} · ${employee.device.version.replace('Version ', '')}`,
                ],
              ]}
            />
            <JumpButton section="employee-details" onJump={onJump}>
              View employee details
            </JumpButton>
          </>
        ),
      };
    case 'Hiring':
      return {
        title: 'Hiring',
        content: (
          <>
            <div className="dialog-metric">{company.hirings}</div>
            <p>Hirings</p>
            <DetailList
              items={[
                ['Onboarding', `${onboarding.percent}%`],
                ['Onboarding Task', `${state.completedTaskIds.length}/${onboarding.totalTasks}`],
              ]}
            />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              View onboarding tasks
            </JumpButton>
          </>
        ),
      };
    case 'device':
    case 'Devices':
      return {
        title: 'Devices',
        content: (
          <>
            <div className="dialog-device">
              <span className="device-image" role="img" aria-label={employee.device.name} />
              <div>
                <strong>{employee.device.name}</strong>
                <br />
                {employee.device.version}
              </div>
            </div>
            <DetailList items={[['Assigned to', employee.name]]} />
            <JumpButton section="employee-details" onJump={onJump}>
              View employee details
            </JumpButton>
          </>
        ),
      };
    case 'salary':
    case 'Salary':
      return {
        title: 'Compensation Summary',
        content: (
          <>
            <p>
              {employee.name} · {employee.role}
            </p>
            <div className="dialog-metric">{employee.compensationLabel}</div>
          </>
        ),
      };
    case 'Apps':
      return {
        title: 'Your workspace',
        content: (
          <div className="dialog-shortcuts">
            <button type="button" onClick={() => onJump('timer-panel')}>
              Time tracker
              <Icon name="timer" />
            </button>
            <button type="button" onClick={() => onJump('calendar-panel')}>
              Calendar
              <Icon name="arrow" />
            </button>
            <button type="button" onClick={() => onJump('onboarding-panel')}>
              Onboarding
              <Icon name="check" />
            </button>
          </div>
        ),
      };
    case 'Reviews':
      return {
        title: 'Reviews',
        content: (
          <>
            <DetailList
              items={onboarding.tasks
                .filter((task) => ['update', 'goals', 'policy'].includes(task.kind))
                .map((task) => [task.title, task.dateLabel])}
            />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              View tasks
            </JumpButton>
          </>
        ),
      };
    case 'projects':
      return {
        title: 'Projects',
        content: (
          <>
            <div className="dialog-metric">{company.projects}</div>
            <DetailList
              items={[
                ['Project time', `${company.allocation.projectTime}%`],
                ['Output', `${company.allocation.output}%`],
              ]}
            />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              View project update
            </JumpButton>
          </>
        ),
      };
    case 'progress':
      return {
        title: 'Work progress',
        content: (
          <>
            <div className="dialog-metric">{progress.weeklyHours.toFixed(1)} h</div>
            <p>Work Time this week</p>
            <DetailList items={[[progress.highlightedDay, progress.highlightedDuration]]} />
            <JumpButton section="progress-panel" onJump={onJump}>
              Back to progress
            </JumpButton>
          </>
        ),
      };
    case 'timer':
      return {
        title: 'Time tracker',
        content: (
          <>
            <p>Current work session</p>
            <div className="dialog-metric" id="modal-timer">
              {timer.display}
            </div>
            <button
              type="button"
              className="dialog-primary"
              onClick={timer.running ? timer.pause : timer.start}
            >
              {timer.running ? 'Pause timer' : 'Start timer'}
            </button>
          </>
        ),
      };
    case 'team-event':
    case 'onboarding-event': {
      const event = data.calendar.events.find(
        (item) => item.kind === (kind === 'team-event' ? 'team' : 'onboarding'),
      );
      return {
        title: event?.title ?? 'Event details',
        content: event ? (
          <>
            <p>{event.subtitle}</p>
            <DetailList items={[['Time', event.timeLabel]]} />
            <JumpButton
              section={kind === 'team-event' ? 'calendar-panel' : 'onboarding-panel'}
              onJump={onJump}
            >
              {kind === 'team-event' ? 'Back to calendar' : 'View onboarding'}
            </JumpButton>
          </>
        ) : (
          <p>No event details available.</p>
        ),
      };
    }
    case 'notifications': {
      const pending = onboarding.tasks.filter((task) => !state.completedTaskIds.includes(task.id));
      return {
        title: 'Notifications',
        content: pending.length ? (
          <>
            <p>
              {pending.length} pending onboarding {pending.length === 1 ? 'task' : 'tasks'}
            </p>
            <DetailList items={pending.map((task) => [task.title, task.dateLabel])} />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              View pending tasks
            </JumpButton>
          </>
        ) : (
          <p>You’re all caught up.</p>
        ),
      };
    }
    case 'settings':
      return {
        title: 'Settings',
        content: (
          <SettingsForm
            preferences={state.preferences}
            saving={props.saving}
            error={props.saveError}
            onSave={props.onSavePreferences}
            onRestore={props.onRestore}
          />
        ),
      };
    default:
      return { title: '', content: null };
  }
}
export function DashboardDialog(props: Props) {
  const view = getDialogView(props);
  return (
    <Modal open={props.kind !== null} title={view.title} onClose={props.onClose}>
      {view.content}
    </Modal>
  );
}
