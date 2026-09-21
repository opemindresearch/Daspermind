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
      <div
        className="portrait-source"
        role="img"
        aria-label="Ilustración de un docente para el perfil de ejemplo"
      />
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
          aria-label={`Ver folio de ejemplo, ${employee.compensationLabel}`}
          onClick={onCompensation}
        >
          {employee.compensationLabel}
        </button>
      </div>
    </section>
  );
}
