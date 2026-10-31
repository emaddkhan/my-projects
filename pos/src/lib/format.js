const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormat.format(date);
}

export function formatTime(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : timeFormat.format(date);
}

export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) return '—';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Formats integer paisa to formatted PKR currency string (e.g. 145000 -> "Rs 1,450.00").
 */
export function formatPaisa(paisa) {
  if (paisa === null || paisa === undefined || !Number.isFinite(Number(paisa))) return 'Rs 0.00';
  const rupees = Number(paisa) / 100;
  return `Rs ${rupees.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Converts integer paisa to decimal rupees string for input fields (e.g. 145050 -> "1450.50").
 */
export function paisaToRupees(paisa) {
  if (paisa === null || paisa === undefined || !Number.isFinite(Number(paisa))) return '0.00';
  return (Number(paisa) / 100).toFixed(2);
}

/**
 * Converts rupee string/number to integer paisa.
 */
export function rupeesToPaisa(rupees) {
  const num = Number(rupees);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}
