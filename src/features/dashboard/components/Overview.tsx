import { Icon } from '@/components/ui/Icon';
import type { DashboardData } from '../model/dashboard.schema';
import type { DialogKind } from '../model/navigation';
export function Overview({
  company,
  pendingTasks,
  onOpen,
}: {
  company: DashboardData['company'];
  pendingTasks: number;
  onOpen: (kind: DialogKind) => void;
}) {
  const allocations = [
    { key: 'interviews', label: 'Registro', value: company.allocation.interviews },
    { key: 'hired', label: 'Perfil', value: company.allocation.hired },
    { key: 'project-time', label: 'Preparación', value: company.allocation.projectTime },
    { key: 'output', label: 'Cita', value: company.allocation.output },
  ];
  return (
    <section className="overview" aria-label="Resumen de admisión de ejemplo">
      <div
        className="allocation"
        aria-label="Avances ilustrativos por sección, no resultados oficiales"
      >
        {allocations.map((item) => (
          <div key={item.key} className={`allocation-item ${item.key}`}>
            <span className="allocation-label">{item.label}</span>
            <div className="allocation-bar">
              <span>{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="company-stats">
        <button type="button" className="stat" data-nav="Hiring" onClick={() => onOpen('Hiring')}>
          <span className="stat-number">
            <Icon name="file" />
            <span>{company.employees}</span>
          </span>
          <span className="stat-label">Documentos</span>
        </button>
        <button type="button" className="stat" data-nav="Devices" onClick={() => onOpen('Devices')}>
          <span className="stat-number">
            <Icon name="book" />
            <span>{company.hirings}</span>
          </span>
          <span className="stat-label">Cursos</span>
        </button>
        <button
          type="button"
          className="stat"
          data-dialog="projects"
          onClick={() => onOpen('projects')}
        >
          <span className="stat-number">
            <Icon name="check" />
            <span id="pending-count">{pendingTasks}</span>
          </span>
          <span className="stat-label">Pendientes</span>
        </button>
      </div>
    </section>
  );
}
