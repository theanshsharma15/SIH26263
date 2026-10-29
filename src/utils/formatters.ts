export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export function getTimeRemaining(expiresAt: string): {
  isExpired: boolean;
  formatted: string;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const diff = new Date(expiresAt).getTime() - new Date().getTime();
  if (diff <= 0) {
    return { isExpired: true, formatted: 'Expired', hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m ${seconds}s remaining`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ${seconds}s remaining`;
  } else {
    formatted = `${seconds}s remaining`;
  }

  return { isExpired: false, formatted, hours, minutes, seconds };
}
