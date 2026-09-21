import { useState, type ReactNode, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import admissionBrand from '@/assets/usicamm/admision.svg';
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
        <span>Recordar mis cambios</span>
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
        <span>Reducir movimiento</span>
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
        {saving ? 'Guardando…' : 'Guardar preferencias'}
      </button>
      <br />
      <button
        type="button"
        className="dialog-secondary"
        id="restore-dashboard"
        disabled={saving}
        onClick={() => void onRestore()}
      >
        Restablecer perfil de ejemplo
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
  const pending = onboarding.tasks.filter((task) => !state.completedTaskIds.includes(task.id));
  const completedPercent = onboarding.totalTasks
    ? Math.round((state.completedTaskIds.length / onboarding.totalTasks) * 100)
    : 0;
  switch (kind) {
    case 'profile':
    case 'People':
      return {
        title: 'Mi perfil docente',
        content: (
          <>
            <p>
              Docente aspirante a la admisión en educación básica. Información ilustrativa del
              perfil.
            </p>
            <DetailList
              items={[
                ['Nombre', employee.name],
                ['Formación', employee.device.name],
                ['Nivel', 'Educación primaria'],
                ['Ciclo de referencia', '2026–2027'],
                ['Folio de ejemplo', employee.compensationLabel],
              ]}
            />
            <JumpButton section="employee-details" onJump={onJump}>
              Ver mis datos
            </JumpButton>
          </>
        ),
      };
    case 'Hiring':
      return {
        title: 'Mi proceso de admisión',
        content: (
          <>
            <img className="admission-brand" src={admissionBrand} alt="Admisión" />
            <p>
              Organiza tu participación y consulta la convocatoria de tu entidad. Este seguimiento
              es personal; no acredita el registro ni la validación de documentos.
            </p>
            <DetailList
              items={[
                ['Documentos de ejemplo', String(company.employees)],
                [
                  'Checklist personal',
                  `${state.completedTaskIds.length} de ${onboarding.totalTasks}`,
                ],
                ['Actividades completadas', `${completedPercent}%`],
                ['Validación oficial', 'Consultar en el portal del proceso'],
              ]}
            />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              Abrir mi checklist
            </JumpButton>
          </>
        ),
      };
    case 'device':
    case 'Devices':
      return {
        title: 'Formación y preparación',
        content: (
          <>
            <div className="dialog-device">
              <span className="device-image" role="img" aria-label="Material de formación" />
              <div>
                <strong>{employee.device.name}</strong>
                <br />
                {employee.device.version}
              </div>
            </div>
            <DetailList
              items={[
                ['Aspirante de ejemplo', employee.name],
                ['Actividades formativas', `${company.hirings} en mi plan personal`],
                ['Curso NEM', 'Habilidades docentes y digitales'],
                ['Estudio autónomo', 'Guía de conocimientos y aptitudes'],
              ]}
            />
            <p>Revisa las indicaciones y los requisitos de tu convocatoria.</p>
            <JumpButton section="progress-panel" onJump={onJump}>
              Ver mi preparación
            </JumpButton>
          </>
        ),
      };
    case 'salary':
    case 'Salary':
      return {
        title: 'Mi participación',
        content: (
          <>
            <p>{employee.name} · Educación primaria</p>
            <div className="dialog-metric">{employee.compensationLabel}</div>
            <p>
              Folio de ejemplo. Los datos y resultados de tu participación oficial se consultan en
              los sistemas de USICAMM.
            </p>
            <DetailList
              items={[
                ['Proceso', 'Admisión en educación básica'],
                ['Ciclo de referencia', '2026–2027'],
                ['Perfil', 'Demostración'],
              ]}
            />
          </>
        ),
      };
    case 'Apps':
      return {
        title: 'Recursos para prepararme',
        content: (
          <>
            <div className="dialog-shortcuts">
              <button type="button" onClick={() => onJump('timer-panel')}>
                Sesión de estudio
                <Icon name="timer" />
              </button>
              <button type="button" onClick={() => onJump('calendar-panel')}>
                Mi agenda
                <Icon name="arrow" />
              </button>
              <button type="button" onClick={() => onJump('onboarding-panel')}>
                Mi checklist
                <Icon name="check" />
              </button>
            </div>
            <p>
              <a
                className="resource-link"
                href="https://usicamm.sep.gob.mx/"
                target="_blank"
                rel="noreferrer"
              >
                Consultar convocatorias y guías en USICAMM
              </a>
            </p>
          </>
        ),
      };
    case 'Reviews':
      return {
        title: 'Avisos y consultas',
        content: (
          <>
            <p>
              Los recordatorios de esta vista son de ejemplo. Consulta las fechas, los avisos y los
              resultados en la convocatoria y los sistemas oficiales.
            </p>
            <DetailList
              items={[
                ['Convocatoria', 'Verificar la correspondiente a tu entidad'],
                ['Curso NEM', 'Revisar el grupo y periodo que te asignen'],
                ['Resultados', 'Consultar la publicación oficial'],
              ]}
            />
            <a
              className="resource-link"
              href="https://usicamm.sep.gob.mx/"
              target="_blank"
              rel="noreferrer"
            >
              Ir al portal de USICAMM
            </a>
            <JumpButton section="calendar-panel" onJump={onJump}>
              Abrir mi agenda personal
            </JumpButton>
          </>
        ),
      };
    case 'projects':
      return {
        title: 'Mis pendientes',
        content: (
          <>
            <div className="dialog-metric">{pending.length}</div>
            <p>
              {pending.length === 1
                ? 'Actividad pendiente en tu checklist.'
                : 'Actividades pendientes en tu checklist.'}
            </p>
            <DetailList items={pending.map((task) => [task.title, task.dateLabel])} />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              Revisar pendientes
            </JumpButton>
          </>
        ),
      };
    case 'progress':
      return {
        title: 'Mi preparación',
        content: (
          <>
            <div className="dialog-metric">{progress.weeklyHours.toFixed(1)} h</div>
            <p>Horas de estudio esta semana · Datos de ejemplo</p>
            <DetailList
              items={[
                [progress.highlightedDay, progress.highlightedDuration],
                ['Objetivo', 'Repasar la guía y organizar mi estudio'],
              ]}
            />
            <JumpButton section="progress-panel" onJump={onJump}>
              Volver a mi preparación
            </JumpButton>
          </>
        ),
      };
    case 'timer':
      return {
        title: 'Tiempo de estudio',
        content: (
          <>
            <p>Mi sesión actual</p>
            <div className="dialog-metric" id="modal-timer">
              {timer.display}
            </div>
            <button
              type="button"
              className="dialog-primary"
              onClick={timer.running ? timer.pause : timer.start}
            >
              {timer.running ? 'Pausar estudio' : 'Iniciar estudio'}
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
        title: event?.title ?? 'Detalle de actividad',
        content: event ? (
          <>
            <p>{event.subtitle}</p>
            <DetailList
              items={[
                ['Fecha y hora', event.timeLabel],
                ['Tipo de actividad', 'Recordatorio personal de ejemplo'],
              ]}
            />
            <p>Este recordatorio no corresponde a una cita oficial de admisión.</p>
            <JumpButton
              section={kind === 'team-event' ? 'calendar-panel' : 'onboarding-panel'}
              onJump={onJump}
            >
              {kind === 'team-event' ? 'Volver a mi agenda' : 'Ver mi checklist'}
            </JumpButton>
          </>
        ) : (
          <p>No hay detalles disponibles.</p>
        ),
      };
    }
    case 'notifications':
      return {
        title: 'Mis notificaciones',
        content: pending.length ? (
          <>
            <p>
              {pending.length} {pending.length === 1 ? 'pendiente' : 'pendientes'} en mi checklist
            </p>
            <DetailList items={pending.map((task) => [task.title, task.dateLabel])} />
            <JumpButton section="onboarding-panel" onJump={onJump}>
              Ver mis pendientes
            </JumpButton>
          </>
        ) : (
          <p>No tienes pendientes en tu checklist.</p>
        ),
      };
    case 'settings':
      return {
        title: 'Ajustes de mi perfil',
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
