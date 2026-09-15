import { createContext, useContext } from 'react';
import type { DashboardService } from '@/services/dashboard.service';
export type AppServices = { dashboard: DashboardService };
export const ServicesContext = createContext<AppServices | null>(null);
export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('ServicesProvider is missing.');
  return services;
}
