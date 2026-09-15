import { Icon, type IconName } from '@/components/ui/Icon';
import type { DashboardData, OnboardingTask } from '../model/dashboard.schema';
const taskIcons: Record<OnboardingTask['kind'], IconName> = {
  interview: 'monitor',
  meeting: 'bolt',
  update: 'message',
  goals: 'ruler',
  policy: 'link',
};
type Props = {
  onboarding: DashboardData['onboarding'];
  completedIds: string[];
  saving: boolean;
  onToggle: (task: OnboardingTask) => void;
};
export function OnboardingCard({ onboarding, completedIds, saving, onToggle }: Props) {
  const completed = new Set(completedIds);
  return (
    <section
      className="panel onboarding-panel"
      id="onboarding-panel"
      aria-labelledby="onboarding-title"
    >
      <div className="panel-heading">
        <h2 id="onboarding-title">Onboarding</h2>
        <span className="onboarding-percentage">{onboarding.percent}%</span>
      </div>
      <div
        className="onboarding-chart"
        aria-label={`Task allocation: ${onboarding.segments.join(', ')} percent`}
      >
        {onboarding.segments.map((value, index) => (
          <div
            key={index}
            className={`onboarding-segment ${['yellow', 'charcoal', 'gray'][index]}`}
          >
            <span className="segment-label">{value}%</span>
            <div>{index === 0 ? 'Task' : null}</div>
          </div>
        ))}
      </div>
      <div className="task-stack">
        <div className="stack-sheet sheet-one" />
        <div className="stack-sheet sheet-two" />
        <div className="task-card">
          <div className="task-heading">
            <h3>Onboarding Task</h3>
            <span id="task-count" aria-live="polite">
              {completed.size}/{onboarding.totalTasks}
            </span>
          </div>
          <div className="task-list">
            {onboarding.tasks.map((task) => (
              <button
                type="button"
                key={task.id}
                className={`task-row${completed.has(task.id) ? ' is-complete' : ''}`}
                data-task={task.id}
                role="checkbox"
                aria-checked={completed.has(task.id)}
                disabled={saving}
                onClick={() => onToggle(task)}
              >
                <span className="task-icon">
                  <Icon name={taskIcons[task.kind]} />
                </span>
                <span className="task-copy">
                  <span className="task-title">{task.title}</span>
                  <span className="task-date">{task.dateLabel}</span>
                </span>
                <span className="task-check">
                  <Icon name="check" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
