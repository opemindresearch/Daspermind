import { useCallback, useEffect, useRef, useState } from 'react';
import { useServices } from '@/app/providers/services-context';
import type { DashboardPreferences, DashboardSnapshot } from '../model/dashboard.schema';

type Operation = (snapshot: DashboardSnapshot) => Promise<DashboardSnapshot>;
export function useDashboard() {
  const { dashboard: service } = useServices();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const snapshotRef = useRef<DashboardSnapshot | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const mounted = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    mounted.current = true;
    void service
      .load(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        snapshotRef.current = result;
        setSnapshot(result);
        setStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, [service, attempt]);

  // Serialize mutations against the last saved state, so rapid actions cannot overwrite each other.
  const run = useCallback((operation: Operation): Promise<DashboardSnapshot | null> => {
    setPending((count) => count + 1);
    setSaveError(null);
    const task = queue.current
      .then(async () => {
        if (!snapshotRef.current) return null;
        const next = await operation(snapshotRef.current);
        if (mounted.current) {
          snapshotRef.current = next;
          setSnapshot(next);
        }
        return next;
      })
      .catch(() => {
        if (mounted.current) setSaveError('Your change could not be saved. Please try again.');
        return null;
      })
      .finally(() => {
        if (mounted.current) setPending((count) => count - 1);
      });
    queue.current = task;
    return task;
  }, []);

  const toggleTask = useCallback(
    (id: string) => run((current) => service.toggleTask(current, id)),
    [run, service],
  );
  const savePreferences = useCallback(
    (preferences: DashboardPreferences) =>
      run((current) => service.savePreferences(current, preferences)),
    [run, service],
  );
  const saveElapsed = useCallback(
    (seconds: number) => run((current) => service.saveElapsed(current, seconds)),
    [run, service],
  );
  const restore = useCallback(() => run((current) => service.restore(current)), [run, service]);
  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }, []);
  return {
    snapshot,
    status,
    saveError,
    isSaving: pending > 0,
    toggleTask,
    savePreferences,
    saveElapsed,
    restore,
    retry,
  };
}
export type DashboardController = ReturnType<typeof useDashboard>;
