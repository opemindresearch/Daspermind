import type { DashboardConnector } from '../contracts/dashboard.connector';
import {
  createInitialState,
  referenceDashboard,
} from '@/features/dashboard/data/reference-dashboard';
import {
  dashboardStateSchema,
  type DashboardPreferences,
  type DashboardState,
} from '@/features/dashboard/model/dashboard.schema';
import type { KeyValueStorage } from '@/lib/storage';

// A separate namespace prevents HR demo tasks from becoming teacher checklist entries.
export const DASHBOARD_STORAGE_KEY = 'daspermind.usicamm.v1';

export class LocalDashboardConnector implements DashboardConnector {
  private readonly storage: KeyValueStorage;
  private state: DashboardState;

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
    this.state = this.readState();
  }

  private readState(): DashboardState {
    const defaults = createInitialState();
    try {
      const raw = this.storage.getItem(DASHBOARD_STORAGE_KEY);
      if (!raw) return defaults;
      const candidate: unknown = JSON.parse(raw);
      const result = dashboardStateSchema.safeParse(candidate);
      if (!result.success) return defaults;
      const ids = new Set(referenceDashboard.onboarding.tasks.map((task) => task.id));
      return {
        ...result.data,
        completedTaskIds: result.data.completedTaskIds.filter((id) => ids.has(id)),
      };
    } catch {
      return defaults;
    }
  }

  async load(signal?: AbortSignal) {
    signal?.throwIfAborted();
    return structuredClone({ data: referenceDashboard, state: this.state });
  }

  async persistState(state: DashboardState, signal?: AbortSignal): Promise<void> {
    signal?.throwIfAborted();
    this.state = dashboardStateSchema.parse(state);
    const saved = state.preferences.rememberChanges
      ? this.state
      : { ...createInitialState(), preferences: state.preferences };
    this.storage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(saved));
  }
  async resetState(preferences: DashboardPreferences, signal?: AbortSignal) {
    const state = { ...createInitialState(), preferences };
    await this.persistState(state, signal);
    return structuredClone(state);
  }
}
