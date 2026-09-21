import { Icon } from '@/components/ui/Icon';
import type { DashboardData } from '../model/dashboard.schema';
export type EmployeeDetailSection = 'pension' | 'devices' | 'compensation' | 'benefits' | null;
type Props = {
  employee: DashboardData['employee'];
  expanded: EmployeeDetailSection;
  onExpand: (section: EmployeeDetailSection) => void;
  onDevice: () => void;
};
export function EmployeeDetailsCard({ employee, expanded, onExpand, onDevice }: Props) {
  const sections = [
    {
      id: 'pension',
      title: 'Datos personales',
      content: <div className="detail-content"><span>{employee.name}</span><strong>Perfil de ejemplo</strong></div>,
    },
    {
      id: 'devices',
      title: 'Formación inicial',
      content: (
        <div className="device-content">
          <span className="device-image" role="img" aria-label={employee.device.name} />
          <div className="device-copy">
            <strong>{employee.device.name}</strong>
            <span>{employee.device.version}</span>
          </div>
          <button
            type="button"
            className="device-more"
            data-dialog="device"
            aria-label={`Ver formación: ${employee.device.name}`}
            onClick={onDevice}
          >
            <Icon name="dots" />
          </button>
        </div>
      ),
    },
    {
      id: 'compensation',
      title: 'Mi participación',
      content: (
        <div className="detail-content">
          <span>Folio de ejemplo</span>
          <strong>{employee.compensationLabel}</strong>
        </div>
      ),
    },
    {
      id: 'benefits',
      title: 'Contacto y ayuda',
      content: <div className="detail-content empty-detail"><a href="https://usicamm.sep.gob.mx/" target="_blank" rel="noreferrer">Consultar el directorio oficial de USICAMM</a></div>,
    },
  ] as const;
  return (
    <section className="panel employee-details" id="employee-details" aria-label="Datos del aspirante">
      {sections.map((section) => (
        <details
          key={section.id}
          name="employee-details"
          id={`${section.id}-details`}
          open={expanded === section.id}
        >
          <summary
            onClick={(event) => {
              event.preventDefault();
              onExpand(expanded === section.id ? null : section.id);
            }}
          >
            {section.title}
            <Icon name="chevron" />
          </summary>
          {section.content}
        </details>
      ))}
    </section>
  );
}
