export function parseFloatOrNull(s: string): number | null {
  const normalized = s.replace(',', '.').trim();
  if (normalized === '') return null;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

export function parseIntOrNull(s: string): number | null {
  const trimmed = s.trim();
  if (trimmed === '') return null;
  const n = parseInt(trimmed, 10);
  return Number.isFinite(n) ? n : null;
}
