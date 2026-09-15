import type { DashboardConnector } from '@/connectors/contracts/dashboard.connector';
import {
  dashboardSnapshotSchema,
  type DashboardPreferences,
  type DashboardSnapshot,
  type DashboardState,
} from '@/features/dashboard/model/dashboard.schema';

/** Business operations, independent from React and the storage transport. */
export class DashboardService {
  private readonly connector: DashboardConnector;
  constructor(connector: DashboardConnector) {
    this.connector = connector;
  }

  async load(signal?: AbortSignal) {
    return dashboardSnapshotSchema.parse(await this.connector.load(signal));
  }

  private async commit(snapshot: DashboardSnapshot, state: DashboardState) {
    const next = dashboardSnapshotSchema.parse({ data: snapshot.data, state });
    await this.connector.persistState(next.state);
    return next;
  }

  toggleTask(snapshot: DashboardSnapshot, taskId: string) {
    if (!snapshot.data.onboarding.tasks.some((task) => task.id === taskId))
      throw new Error('This task does not exist.');
    const ids = new Set(snapshot.state.completedTaskIds);
    if (ids.has(taskId)) ids.delete(taskId);
    else ids.add(taskId);
    return this.commit(snapshot, { ...snapshot.state, completedTaskIds: [...ids] });
  }
  savePreferences(snapshot: DashboardSnapshot, preferences: DashboardPreferences) {
    return this.commit(snapshot, { ...snapshot.state, preferences });
  }
  saveElapsed(snapshot: DashboardSnapshot, elapsedSeconds: number) {
    return this.commit(snapshot, { ...snapshot.state, elapsedSeconds });
  }
  async restore(snapshot: DashboardSnapshot) {
    const state = await this.connector.resetState(snapshot.state.preferences);
    return dashboardSnapshotSchema.parse({ data: snapshot.data, state });
  }
}
