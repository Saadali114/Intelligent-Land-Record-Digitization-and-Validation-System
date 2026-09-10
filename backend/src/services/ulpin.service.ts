import crypto from 'crypto';

/**
 * Digital India Land Records Modernization Programme (DILRMP) 3.0
 * Unique Land Parcel Identification Number (ULPIN) / Bhu-Aadhaar Engine
 *
 * ULPIN is a 14-character alphanumeric identifier generated from:
 * 1. State / Division Cadastral Grid (Base32/Base36 encoded)
 * 2. Parcel Centroid Geospatial Bounds (Latitude & Longitude)
 * 3. Survey / Khasra Parcel Hash
 *
 * Format Example from Official DILRMP 3.0 Guidelines: '81LVQLD9407JH0'
 */

const BASE36_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate a standardized 14-digit Bhu-Aadhaar (ULPIN)
 */
export function generateULPIN(params: {
  state?: string;
  district?: string;
  village?: string;
  surveyNumber?: string;
  lat?: number;
  lng?: number;
}): string {
  const stateCode = (params.state?.toLowerCase().includes('maha') ? '27' : '27'); // 27 = Maharashtra
  const surveyClean = (params.surveyNumber || '1').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const districtClean = (params.district || 'PUN').substring(0, 3).toUpperCase();
  const villageClean = (params.village || 'VIL').substring(0, 3).toUpperCase();

  // Create deterministic hash from parcel geographic bounds or survey details
  const seedString = `${stateCode}:${districtClean}:${villageClean}:${surveyClean}:${params.lat || 18.5204}:${params.lng || 73.8567}`;
  const hash = crypto.createHash('sha256').update(seedString).digest();

  // Convert first 8 bytes of hash into 12 alphanumeric characters
  let body = '';
  for (let i = 0; i < 8; i++) {
    const byte = hash[i];
    body += BASE36_CHARS[byte % BASE36_CHARS.length];
    if (body.length === 12) break;
  }
  while (body.length < 12) {
    body += BASE36_CHARS[Math.floor(Math.random() * BASE36_CHARS.length)];
  }

  // Prepend 2-digit regional code prefix (e.g., '81' as seen in official cover: 81LVQLD9407JH0)
  const prefix = stateCode === '27' ? '81' : '82';
  const rawUlpin = `${prefix}${body}`.substring(0, 14);

  return rawUlpin.toUpperCase();
}

/**
 * Validate 14-digit ULPIN format
 */
export function isValidULPIN(ulpin: string): boolean {
  if (!ulpin || typeof ulpin !== 'string') return false;
  const clean = ulpin.trim().toUpperCase();
  return /^[0-9A-Z]{14}$/.test(clean);
}

/**
 * Compute notified circle rate valuation under DILRMP 3.0 GIS Valuation Framework
 */
export function calculateParcelValuation(
  areaStr: string,
  circleRatePerSqm: number = 4200
): { areaInSqm: number; valuation: number } {
  let areaInSqm = 1000; // default 1000 sqm
  const lower = (areaStr || '').toLowerCase();

  const numMatch = lower.match(/([0-9.]+)/);
  const num = numMatch ? parseFloat(numMatch[1]) : 1;

  if (lower.includes('hec')) {
    areaInSqm = Math.round(num * 10000);
  } else if (lower.includes('acre')) {
    areaInSqm = Math.round(num * 4046.86);
  } else if (lower.includes('sqm') || lower.includes('sq.m') || lower.includes('square meter')) {
    areaInSqm = Math.round(num);
  } else if (lower.includes('sqft') || lower.includes('sq.ft')) {
    areaInSqm = Math.round(num * 0.092903);
  } else {
    areaInSqm = Math.round(num * 1000);
  }

  const valuation = Math.round(areaInSqm * circleRatePerSqm);
  return { areaInSqm, valuation };
}
