import type { DashboardConnector } from '../contracts/dashboard.connector';
import {
  dashboardSnapshotSchema,
  dashboardStateSchema,
  preferencesSchema,
  type DashboardPreferences,
  type DashboardState,
} from '@/features/dashboard/model/dashboard.schema';
import { HttpClient } from './http-client';

/** Optional adapter; its API contract is documented in docs/connectors.md. */
export class HttpDashboardConnector implements DashboardConnector {
  private readonly client: HttpClient;
  constructor(client: HttpClient) {
    this.client = client;
  }
  load(signal?: AbortSignal) {
    return this.client.request('dashboard', { method: 'GET', signal }, (value) =>
      dashboardSnapshotSchema.parse(value),
    );
  }
  persistState(state: DashboardState, signal?: AbortSignal) {
    return this.client.request(
      'dashboard/state',
      { method: 'PUT', signal, body: JSON.stringify(dashboardStateSchema.parse(state)) },
      () => undefined,
    );
  }
  resetState(preferences: DashboardPreferences, signal?: AbortSignal) {
    return this.client.request(
      'dashboard/state/reset',
      {
        method: 'POST',
        signal,
        body: JSON.stringify({ preferences: preferencesSchema.parse(preferences) }),
      },
      (value) => dashboardStateSchema.parse(value),
    );
  }
}
