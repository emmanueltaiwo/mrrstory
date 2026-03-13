export function formatRelativeTime(timestampMs: number): string {
  const now = Date.now();
  const diff = Math.max(0, now - timestampMs);

  if (diff < 10_000) return 'just now';
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec} ${sec === 1 ? 'second' : 'seconds'} ago`;
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(diff / 3_600_000);
  if (hr < 24) return `${hr} ${hr === 1 ? 'hour' : 'hours'} ago`;
  const day = Math.floor(diff / 86_400_000);
  if (day < 30) return `${day} ${day === 1 ? 'day' : 'days'} ago`;
  const mo = Math.floor(diff / (30 * 86_400_000));
  if (mo < 12) return `${mo} mo ago`;
  const yr = Math.floor(diff / (365 * 86_400_000));
  return `${yr} yr ago`;
}
