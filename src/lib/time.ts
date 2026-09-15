export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remaining = safe % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours
    ? `${pad(hours)}:${pad(minutes)}:${pad(remaining)}`
    : `${pad(minutes)}:${pad(remaining)}`;
}
export function elapsedAt(base: number, startedAt: number | null, now: number) {
  return base + (startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000)));
}
