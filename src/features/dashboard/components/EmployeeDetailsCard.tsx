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
      title: 'Pension contributions',
      content: <div className="detail-content empty-detail">No contribution details added.</div>,
    },
    {
      id: 'devices',
      title: 'Devices',
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
            aria-label={`${employee.device.name} details`}
            onClick={onDevice}
          >
            <Icon name="dots" />
          </button>
        </div>
      ),
    },
    {
      id: 'compensation',
      title: 'Compensation Summary',
      content: (
        <div className="detail-content">
          <span>Compensation</span>
          <strong>{employee.compensationLabel}</strong>
        </div>
      ),
    },
    {
      id: 'benefits',
      title: 'Employee Benefits',
      content: <div className="detail-content empty-detail">No benefit details added.</div>,
    },
  ] as const;
  return (
    <section className="panel employee-details" id="employee-details" aria-label="Employee details">
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
