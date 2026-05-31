const MONTHS_PL = [
  'sty',
  'lut',
  'mar',
  'kwi',
  'maj',
  'cze',
  'lip',
  'sie',
  'wrz',
  'paź',
  'lis',
  'gru',
];

export function formatDate(d: Date): string {
  const day = d.getDate();
  const month = MONTHS_PL[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateTime(d: Date): string {
  const hour = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(d)}, ${hour}:${min}`;
}

export function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '0 min';
  const totalMin = Math.floor(seconds / 60);
  if (totalMin < 60) return `${totalMin} min`;
  const hours = Math.floor(totalMin / 60);
  const remMin = totalMin % 60;
  return `${hours} h ${remMin} min`;
}

export function formatVolume(volume: number | null): string {
  return `${Math.round(volume ?? 0)} kg`;
}
