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

export const DASHBOARD_STORAGE_KEY = 'daspermind.dashboard.v1';
const LEGACY_STORAGE_KEY = 'crextio-dashboard-v1';

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
      let candidate: unknown;
      if (raw) candidate = JSON.parse(raw);
      else {
        const legacy = JSON.parse(this.storage.getItem(LEGACY_STORAGE_KEY) ?? 'null') as Record<
          string,
          unknown
        > | null;
        if (!legacy) return defaults;
        const settings = legacy.settings as
          { remember?: boolean; reduceMotion?: boolean } | undefined;
        candidate = {
          ...defaults,
          completedTaskIds: legacy.completed ?? defaults.completedTaskIds,
          elapsedSeconds: legacy.elapsed ?? defaults.elapsedSeconds,
          preferences: {
            rememberChanges: settings?.remember ?? true,
            reduceMotion: settings?.reduceMotion ?? false,
          },
        };
      }
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
    // Prevent old data from being reimported after opting out of persistence.
    this.storage.removeItem(LEGACY_STORAGE_KEY);
  }
  async resetState(preferences: DashboardPreferences, signal?: AbortSignal) {
    const state = { ...createInitialState(), preferences };
    await this.persistState(state, signal);
    return structuredClone(state);
  }
}
