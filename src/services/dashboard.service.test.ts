import { describe, expect, it, vi } from 'vitest';
import type { DashboardConnector } from '@/connectors/contracts/dashboard.connector';
import {
  createInitialState,
  referenceDashboard,
} from '@/features/dashboard/data/reference-dashboard';
import { DashboardService } from './dashboard.service';

function setup() {
  const snapshot = structuredClone({ data: referenceDashboard, state: createInitialState() });
  const connector = {
    load: vi.fn().mockResolvedValue(snapshot),
    persistState: vi.fn().mockResolvedValue(undefined),
    resetState: vi.fn().mockResolvedValue(createInitialState()),
  } satisfies DashboardConnector;
  return { snapshot, connector, service: new DashboardService(connector) };
}

describe('dashboard service', () => {
  it('toggles an existing task without mutating the caller snapshot', async () => {
    const { snapshot, connector, service } = setup();
    const updated = await service.toggleTask(snapshot, 'curso');
    expect(updated.state.completedTaskIds).toEqual(['convocatoria', 'expediente', 'curso']);
    expect(snapshot.state.completedTaskIds).toEqual(['convocatoria', 'expediente']);
    expect(connector.persistState).toHaveBeenCalledWith(updated.state);
    const reopened = await service.toggleTask(updated, 'curso');
    expect(reopened.state.completedTaskIds).toEqual(snapshot.state.completedTaskIds);
  });

  it('rejects unknown tasks and invalid elapsed values before writing', async () => {
    const { snapshot, connector, service } = setup();
    expect(() => service.toggleTask(snapshot, 'missing')).toThrow('This task does not exist.');
    await expect(service.saveElapsed(snapshot, -2)).rejects.toThrow();
    expect(connector.persistState).not.toHaveBeenCalled();
  });

  it('propagates persistence errors and retains the original snapshot', async () => {
    const { snapshot, connector, service } = setup();
    connector.persistState.mockRejectedValue(new Error('Connection lost'));
    await expect(service.toggleTask(snapshot, 'curso')).rejects.toThrow('Connection lost');
    expect(snapshot.state).toEqual(createInitialState());
  });

  it('rejects inconsistent server snapshots, including unknown completed task ids', async () => {
    const { snapshot, service } = setup();
    snapshot.state.completedTaskIds.push('missing');
    await expect(service.load()).rejects.toThrow('Unknown completed task');
  });

  it('rejects duplicate tasks even if the rest of the response is well formed', async () => {
    const { snapshot, service } = setup();
    snapshot.data.onboarding.tasks.push(snapshot.data.onboarding.tasks[0]);
    await expect(service.load()).rejects.toThrow('Duplicate tasks');
  });

  it('delegates reset to the active connector with the current preferences', async () => {
    const { snapshot, connector, service } = setup();
    snapshot.state.preferences.reduceMotion = true;
    const reset = { ...createInitialState(), preferences: snapshot.state.preferences };
    connector.resetState.mockResolvedValue(reset);
    expect((await service.restore(snapshot)).state).toEqual(reset);
    expect(connector.resetState).toHaveBeenCalledWith(snapshot.state.preferences);
  });
});
