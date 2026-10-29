/**
 * APAAR (Automated Permanent Academic Account Registry) Utilities
 * APAAR ID is a unique 12-digit number for students across Indian higher education.
 */

export function cleanApaarId(raw: string): string {
  if (!raw) return '';
  return raw.replace(/[^0-9]/g, '');
}

export function formatApaarId(raw: string): string {
  const digits = cleanApaarId(raw);
  if (!digits) return '';
  const parts: string[] = [];
  for (let i = 0; i < digits.length && i < 12; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join('-');
}

export function maskApaarId(raw: string): string {
  const digits = cleanApaarId(raw);
  if (digits.length !== 12) {
    return 'XXXX-XXXX-XXXX';
  }
  const last4 = digits.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function isValidApaarFormat(raw: string): { isValid: boolean; error?: string } {
  if (!raw || raw.trim() === '') {
    return { isValid: false, error: 'APAAR ID is missing or empty' };
  }
  const digits = cleanApaarId(raw);
  if (digits.length !== 12) {
    return { isValid: false, error: `Invalid length: Expected 12 digits, found ${digits.length}` };
  }
  // Check for dummy repeated digits e.g. 000000000000
  if (/^(\d)\1{11}$/.test(digits)) {
    return { isValid: false, error: 'Repeated placeholder digits not permitted' };
  }
  return { isValid: true };
}
