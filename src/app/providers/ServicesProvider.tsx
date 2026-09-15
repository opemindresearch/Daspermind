import { useState, type ReactNode } from 'react';
import { readEnvironment } from '@/config/env';
import { createDashboardConnector } from '@/connectors/create-dashboard-connector';
import { DashboardService } from '@/services/dashboard.service';
import { ServicesContext, type AppServices } from './services-context';

export function ServicesProvider({
  children,
  services,
}: {
  children: ReactNode;
  services?: AppServices;
}) {
  const [resolved] = useState(
    () =>
      services ?? { dashboard: new DashboardService(createDashboardConnector(readEnvironment())) },
  );
  return <ServicesContext.Provider value={resolved}>{children}</ServicesContext.Provider>;
}
