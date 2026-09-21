import { IconButton } from '@/components/ui/IconButton';
import type { WorkTimer } from '../hooks/useWorkTimer';
const ticks = Array.from({ length: 60 }, (_, index) => index);
export function TimeTrackerCard({ timer, onDetails }: { timer: WorkTimer; onDetails: () => void }) {
  return (
    <section
      className={`panel timer-panel${timer.running ? ' is-running' : ''}`}
      id="timer-panel"
      aria-labelledby="timer-title"
    >
      <div className="panel-heading">
        <h2 id="timer-title">Mi estudio</h2>
        <IconButton
          icon="arrow"
          label="Ver tiempo de estudio"
          data-dialog="timer"
          onClick={onDetails}
        />
      </div>
      <div className="clock-face">
        <svg className="timer-dial" viewBox="0 0 200 200" aria-hidden="true">
          <g>
            {ticks.map((tick) => (
              <line
                key={tick}
                x1="100"
                y1="17"
                x2="100"
                y2={tick % 5 === 0 ? 24 : 22}
                transform={`rotate(${tick * 6} 100 100)`}
                className="timer-tick"
              />
            ))}
          </g>
          <circle className="timer-arc" cx="100" cy="100" r="81" pathLength="100" />
        </svg>
        <div className="timer-reading">
          <span id="timer-display" role="timer" aria-label="Tiempo de estudio transcurrido">
            {timer.display}
          </span>
          <span id="timer-caption">{timer.running ? 'Estudiando' : 'Sesión de estudio'}</span>
        </div>
      </div>
      <div className="timer-controls">
        <div className="playback-controls">
          <IconButton
            icon="play"
            label="Iniciar estudio"
            id="timer-play"
            aria-pressed={timer.running}
            aria-disabled={timer.running}
            onClick={timer.start}
          />
          <IconButton
            icon="pause"
            label="Pausar estudio"
            id="timer-pause"
            aria-disabled={!timer.running}
            onClick={timer.pause}
          />
        </div>
        <IconButton
          icon="timer"
          label="Reiniciar tiempo"
          id="timer-reset"
          className="dark"
          onClick={timer.reset}
        />
      </div>
    </section>
  );
}
