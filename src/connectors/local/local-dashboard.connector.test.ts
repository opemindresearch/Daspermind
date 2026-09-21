import { describe, expect, it } from 'vitest';
import { createInitialState } from '@/features/dashboard/data/reference-dashboard';
import { createSafeStorage, type KeyValueStorage } from '@/lib/storage';
import { DASHBOARD_STORAGE_KEY, LocalDashboardConnector } from './local-dashboard.connector';

describe('local dashboard persistence', () => {
  it('restores saved tasks and time in a new connector instance', async () => {
    const storage = createSafeStorage();
    const connector = new LocalDashboardConnector(storage);
    const state = { ...createInitialState(), completedTaskIds: ['curso'], elapsedSeconds: 3610 };
    await connector.persistState(state);
    expect((await new LocalDashboardConnector(storage).load()).state).toEqual(state);
  });

  it('keeps session changes in memory but restores reference data when remembering is disabled', async () => {
    const storage = createSafeStorage();
    const connector = new LocalDashboardConnector(storage);
    const state = {
      ...createInitialState(),
      completedTaskIds: ['guia'],
      elapsedSeconds: 7200,
      preferences: { rememberChanges: false, reduceMotion: true },
    };
    await connector.persistState(state);
    expect((await connector.load()).state).toEqual(state);
    expect((await new LocalDashboardConnector(storage).load()).state).toEqual({
      ...createInitialState(),
      preferences: state.preferences,
    });
  });

  it('keeps the teacher profile independent from the previous HR demo state', async () => {
    const storage = createSafeStorage();
    storage.setItem(
      'crextio-dashboard-v1',
      JSON.stringify({
        completed: ['policy'],
        elapsed: 400,
        settings: { remember: true, reduceMotion: true },
      }),
    );
    storage.setItem(
      'daspermind.dashboard.v1',
      JSON.stringify({
        ...createInitialState(),
        completedTaskIds: ['interview'],
        elapsedSeconds: 900,
      }),
    );
    const connector = new LocalDashboardConnector(storage);
    const { state } = await connector.load();
    expect(state).toEqual(createInitialState());
    await connector.persistState(state);
    expect(storage.getItem('crextio-dashboard-v1')).not.toBeNull();
    expect(storage.getItem('daspermind.dashboard.v1')).not.toBeNull();
    expect(storage.getItem(DASHBOARD_STORAGE_KEY)).not.toBeNull();
  });

  it.each([
    'invalid JSON',
    JSON.stringify({ schemaVersion: 9 }),
    JSON.stringify({
      ...createInitialState(),
      elapsedSeconds: -1,
    }),
  ])('recovers from malformed saved state: %s', async (raw) => {
    const storage = createSafeStorage();
    storage.setItem(DASHBOARD_STORAGE_KEY, raw);
    expect((await new LocalDashboardConnector(storage).load()).state).toEqual(createInitialState());
  });

  it('discards saved task ids that are no longer present in the data', async () => {
    const storage = createSafeStorage();
    storage.setItem(
      DASHBOARD_STORAGE_KEY,
      JSON.stringify({
        ...createInitialState(),
        completedTaskIds: ['convocatoria', 'removed-task'],
      }),
    );
    expect((await new LocalDashboardConnector(storage).load()).state.completedTaskIds).toEqual([
      'convocatoria',
    ]);
  });

  it('remains usable when browser storage is blocked', async () => {
    const denied = () => {
      throw new DOMException('Storage disabled', 'SecurityError');
    };
    const storage = createSafeStorage({
      getItem: denied,
      setItem: denied,
      removeItem: denied,
    } satisfies KeyValueStorage);
    const connector = new LocalDashboardConnector(storage);
    const state = { ...createInitialState(), elapsedSeconds: 88 };
    await expect(connector.persistState(state)).resolves.toBeUndefined();
    expect((await connector.load()).state.elapsedSeconds).toBe(88);
  });

  it('returns isolated snapshots and preserves preferences when resetting', async () => {
    const connector = new LocalDashboardConnector(createSafeStorage());
    const first = await connector.load();
    first.data.employee.name = 'Changed';
    first.state.completedTaskIds.push('curso');
    expect((await connector.load()).data.employee.name).toBe('Luis Herrera');
    expect((await connector.load()).state.completedTaskIds).toHaveLength(2);
    const preferences = { rememberChanges: true, reduceMotion: true };
    expect(await connector.resetState(preferences)).toEqual({
      ...createInitialState(),
      preferences,
    });
  });
});
