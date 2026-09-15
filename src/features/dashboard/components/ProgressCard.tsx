import type { CSSProperties } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import type { DashboardData } from '../model/dashboard.schema';
// Geometry reconstructed from the image; not invented daily work-hour measurements.
const bars = [
  { id: 'sun', label: 'S', top: 52, height: 62, weekend: true },
  { id: 'mon', label: 'M', top: 28, height: 86 },
  { id: 'tue', label: 'T', top: 42, height: 51 },
  { id: 'wed', label: 'W', top: 59, height: 51 },
  { id: 'thu', label: 'T', top: 25, height: 78 },
  { id: 'fri', label: 'F', top: 14, height: 100, selected: true },
  { id: 'sat', label: 'S', top: 59, height: 55, weekend: true },
];
type BarStyle = CSSProperties & { '--bar-top': number; '--bar-height': number };
export function ProgressCard({
  progress,
  onDetails,
}: {
  progress: DashboardData['progress'];
  onDetails: () => void;
}) {
  return (
    <section className="panel progress-panel" id="progress-panel" aria-labelledby="progress-title">
      <div className="panel-heading">
        <h2 id="progress-title">Progress</h2>
        <IconButton
          icon="arrow"
          label="View work progress details"
          data-dialog="progress"
          onClick={onDetails}
        />
      </div>
      <div className="progress-summary">
        <strong>{progress.weeklyHours.toFixed(1)} h</strong>
        <span>
          Work Time
          <br />
          this week
        </span>
      </div>
      <div
        className="week-chart"
        aria-label={`Work time by day, ${progress.highlightedDay} selected: ${progress.highlightedDuration}`}
      >
        <div className="chart-rule" />
        {bars.map((bar) => {
          const style: BarStyle = { '--bar-top': bar.top, '--bar-height': bar.height };
          const content = (
            <>
              <div className="bar-track">
                {bar.selected ? (
                  <span className="chart-tooltip">{progress.highlightedDuration}</span>
                ) : null}
                <i className="work-bar" style={style} />
              </div>
              <i className="day-dot" />
              <span>{bar.label}</span>
            </>
          );
          return bar.selected ? (
            <button
              type="button"
              key={bar.id}
              className="day-column selected"
              data-dialog="progress"
              aria-label={`${progress.highlightedDay}, ${progress.highlightedDuration}`}
              onClick={onDetails}
            >
              {content}
            </button>
          ) : (
            <div key={bar.id} className={`day-column${bar.weekend ? ' weekend' : ''}`}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
