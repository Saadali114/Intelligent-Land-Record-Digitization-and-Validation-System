/**
 * Indian Mobile Number Normalization & Validation Utility
 * Standardizes mobile numbers into E.164 international format (+91XXXXXXXXXX)
 */

export function normalizeIndianMobile(raw: string): string {
  if (!raw) return '';

  // Remove spaces, hyphens, parentheses, and dots
  let cleaned = raw.replace(/[\s\-\(\)\.]/g, '');

  // Handle +91 prefix
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Exactly 10 digits
  return `+91${cleaned}`;
}

export function isValidIndianMobile(raw: string): boolean {
  if (!raw) return false;
  const cleaned = raw.replace(/[\s\-\(\)\.]/g, '');

  // Strip international country code if present
  let digits = cleaned;
  if (digits.startsWith('+91')) {
    digits = digits.substring(3);
  } else if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.substring(1);
  }

  // Valid Indian mobile numbers: exactly 10 digits, starts with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(digits);
}

export function maskMobile(mobile: string): string {
  if (!mobile) return '';
  const normalized = normalizeIndianMobile(mobile);
  // Format: +91 ******3210
  if (normalized.length >= 13) {
    const last4 = normalized.slice(-4);
    return `+91 ******${last4}`;
  }
  return normalized;
}
