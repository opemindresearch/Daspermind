import { AppErrorBoundary } from '@/components/ui/AppErrorBoundary';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ServicesProvider } from './providers/ServicesProvider';
export function App() {
  return (
    <AppErrorBoundary>
      <ServicesProvider>
        <DashboardPage />
      </ServicesProvider>
    </AppErrorBoundary>
  );
}
