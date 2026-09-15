import { useCallback, useEffect, useState } from 'react';
import { elapsedAt, formatDuration } from '@/lib/time';

type Clock = { base: number; startedAt: number | null };
type Persist = (seconds: number) => Promise<unknown>;
export function useWorkTimer(
  initialSeconds: number,
  persist: Persist,
  notify: (message: string) => void,
) {
  const [clock, setClock] = useState<Clock>(() => ({ base: initialSeconds, startedAt: null }));
  const [now, setNow] = useState(0);
  const running = clock.startedAt !== null;
  const current = elapsedAt(clock.base, clock.startedAt, now);

  useEffect(() => {
    if (clock.startedAt === null) return;
    let lastSaved = performance.now();
    const tick = () => {
      const timestamp = performance.now();
      setNow(timestamp);
      if (timestamp - lastSaved >= 15_000) {
        lastSaved = timestamp;
        void persist(elapsedAt(clock.base, clock.startedAt, timestamp));
      }
    };
    let interval = window.setInterval(tick, 250);
    const saveCurrent = () => {
      void persist(elapsedAt(clock.base, clock.startedAt, performance.now()));
    };
    const visibility = () => {
      clearInterval(interval);
      if (document.hidden) saveCurrent();
      else {
        tick();
        interval = window.setInterval(tick, 250);
      }
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', saveCurrent);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', saveCurrent);
    };
  }, [clock, persist]);

  const start = useCallback(() => {
    if (clock.startedAt !== null) return;
    const timestamp = performance.now();
    setNow(timestamp);
    setClock({ base: clock.base, startedAt: timestamp });
    notify('Time tracker started');
  }, [clock, notify]);
  const pause = useCallback(() => {
    if (clock.startedAt === null) return;
    const seconds = elapsedAt(clock.base, clock.startedAt, performance.now());
    setClock({ base: seconds, startedAt: null });
    void persist(seconds);
    notify('Time tracker paused');
  }, [clock, persist, notify]);
  const reset = useCallback(() => {
    setClock({ base: 0, startedAt: null });
    void persist(0);
    notify('Timer reset');
  }, [persist, notify]);
  const restore = useCallback(
    (seconds: number) => setClock({ base: seconds, startedAt: null }),
    [],
  );
  return {
    running,
    seconds: current,
    display: formatDuration(current),
    start,
    pause,
    reset,
    restore,
  };
}
export type WorkTimer = ReturnType<typeof useWorkTimer>;
