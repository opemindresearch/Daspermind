import type { DashboardData } from '../model/dashboard.schema';
export function ProfileCard({
  employee,
  onCompensation,
}: {
  employee: DashboardData['employee'];
  onCompensation: () => void;
}) {
  return (
    <section
      className="profile-card"
      id="profile-card"
      aria-label={`${employee.name}, ${employee.role}`}
    >
      <div className="portrait-source" role="img" aria-label={`${employee.name} smiling`} />
      <div className="portrait-shade" />
      <div className="profile-caption">
        <div>
          <h2>{employee.name}</h2>
          <p>{employee.role}</p>
        </div>
        <button
          type="button"
          className="salary-pill"
          data-dialog="salary"
          aria-label={`View compensation summary, ${employee.compensationLabel}`}
          onClick={onCompensation}
        >
          {employee.compensationLabel}
        </button>
      </div>
    </section>
  );
}
