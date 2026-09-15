import { Icon } from '@/components/ui/Icon';
import type { DashboardData } from '../model/dashboard.schema';
import type { DialogKind } from '../model/navigation';
export function Overview({
  company,
  onOpen,
}: {
  company: DashboardData['company'];
  onOpen: (kind: DialogKind) => void;
}) {
  const allocations = [
    { key: 'interviews', label: 'Interviews', value: company.allocation.interviews },
    { key: 'hired', label: 'Hired', value: company.allocation.hired },
    { key: 'project-time', label: 'Project time', value: company.allocation.projectTime },
    { key: 'output', label: 'Output', value: company.allocation.output },
  ];
  return (
    <section className="overview" aria-label="Company overview">
      <div className="allocation" aria-label="Work allocation">
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
        <button type="button" className="stat" data-nav="People" onClick={() => onOpen('People')}>
          <span className="stat-number">
            <Icon name="people" />
            <span>{company.employees}</span>
          </span>
          <span className="stat-label">Employe</span>
        </button>
        <button type="button" className="stat" data-nav="Hiring" onClick={() => onOpen('Hiring')}>
          <span className="stat-number">
            <Icon name="user-plus" />
            <span>{company.hirings}</span>
          </span>
          <span className="stat-label">Hirings</span>
        </button>
        <button
          type="button"
          className="stat"
          data-dialog="projects"
          onClick={() => onOpen('projects')}
        >
          <span className="stat-number">
            <Icon name="laptop" />
            <span>{company.projects}</span>
          </span>
          <span className="stat-label">Projects</span>
        </button>
      </div>
    </section>
  );
}
