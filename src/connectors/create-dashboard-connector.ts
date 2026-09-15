import type { AppEnvironment } from '@/config/env';
import { createBrowserStorage } from '@/lib/storage';
import { LocalDashboardConnector } from './local/local-dashboard.connector';
import { HttpClient } from './http/http-client';
import { HttpDashboardConnector } from './http/http-dashboard.connector';
import type { DashboardConnector } from './contracts/dashboard.connector';

export function createDashboardConnector(env: AppEnvironment): DashboardConnector {
  if (env.dataSource === 'http')
    return new HttpDashboardConnector(new HttpClient({ baseUrl: env.apiBaseUrl }));
  return new LocalDashboardConnector(createBrowserStorage());
}
