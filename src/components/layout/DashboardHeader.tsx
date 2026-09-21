import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import {
  navigationItems,
  navigationLabels,
  type NavigationItem,
  type DialogKind,
} from '@/features/dashboard/model/navigation';
type Props = {
  active: DialogKind | null;
  employeeName: string;
  pendingTasks: number;
  onNavigate: (item: NavigationItem) => void;
  onOpen: (kind: DialogKind) => void;
};
export function DashboardHeader({ active, employeeName, pendingTasks, onNavigate, onOpen }: Props) {
  return (
    <header className="topbar">
      <a className="wordmark" href="#main" aria-label="USICAMM, perfil docente de ejemplo">
        USICAMM
      </a>
      <nav className="main-nav" aria-label="Navegación principal">
        {navigationItems.map((item) => {
          const selected =
            active === item ||
            (item === 'Dashboard' && !navigationItems.some((nav) => nav === active));
          return (
            <button
              key={item}
              type="button"
              className={`nav-link${selected ? ' is-active' : ''}`}
              data-nav={item}
              aria-current={selected ? 'page' : undefined}
              onClick={() => onNavigate(item)}
            >
              {navigationLabels[item]}
            </button>
          );
        })}
      </nav>
      <div className="utility-nav">
        <button
          type="button"
          className="settings-button"
          data-dialog="settings"
          onClick={() => onOpen('settings')}
        >
          <Icon name="settings" />
          <span>Ajustes</span>
        </button>
        <IconButton
          icon="bell"
          label={`Notificaciones, ${pendingTasks} ${pendingTasks === 1 ? 'pendiente' : 'pendientes'}`}
          className="notification-button"
          data-dialog="notifications"
          onClick={() => onOpen('notifications')}
        >
          {pendingTasks > 0 ? <span className="notification-dot" /> : null}
        </IconButton>
        <IconButton
          icon="user"
          label={`Abrir el perfil de ${employeeName}`}
          data-dialog="profile"
          onClick={() => onOpen('profile')}
        />
      </div>
    </header>
  );
}
