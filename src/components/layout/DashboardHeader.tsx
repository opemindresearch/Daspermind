import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import {
  navigationItems,
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
      <a className="wordmark" href="#main" aria-label="Crextio home">
        Crextio
      </a>
      <nav className="main-nav" aria-label="Main navigation">
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
              {item}
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
          <span>Setting</span>
        </button>
        <IconButton
          icon="bell"
          label={`Notifications, ${pendingTasks} pending ${pendingTasks === 1 ? 'task' : 'tasks'}`}
          className="notification-button"
          data-dialog="notifications"
          onClick={() => onOpen('notifications')}
        >
          {pendingTasks > 0 ? <span className="notification-dot" /> : null}
        </IconButton>
        <IconButton
          icon="user"
          label={`Open ${employeeName}'s profile`}
          data-dialog="profile"
          onClick={() => onOpen('profile')}
        />
      </div>
    </header>
  );
}
