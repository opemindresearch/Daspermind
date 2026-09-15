import type {
  DashboardPreferences,
  DashboardSnapshot,
  DashboardState,
} from '@/features/dashboard/model/dashboard.schema';

/** Transport boundary: components never depend on browser storage or fetch. */
export interface DashboardConnector {
  load(signal?: AbortSignal): Promise<DashboardSnapshot>;
  persistState(state: DashboardState, signal?: AbortSignal): Promise<void>;
  resetState(preferences: DashboardPreferences, signal?: AbortSignal): Promise<DashboardState>;
}
