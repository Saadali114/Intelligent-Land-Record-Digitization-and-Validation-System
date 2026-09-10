import React from 'react';
import ApplicationDetailClient from './ApplicationDetailClient';

export function generateStaticParams() {
  const ids = [
    'ILRDVS-2026-000124',
    'ILRDVS-2026-000098',
    'ILRDVS-2026-000075',
    'ILRDVS-2026-000125',
    'ILRDVS-2026-000130',
    'ILRDVS-2026-000131',
    'ILRDVS-2026-000132',
    'ILRDVS-2026-000133',
    'ILRDVS-2026-000134',
    'ILRDVS-2026-000135',
  ];

  // Generate range for applications 000001 to 000250
  for (let i = 1; i <= 250; i++) {
    const padded = String(i).padStart(6, '0');
    ids.push(`ILRDVS-2026-${padded}`);
  }

  const unique = Array.from(new Set(ids));
  return unique.map((id) => ({ id }));
}

export default function ApplicationDetailPage() {
  return <ApplicationDetailClient />;
}
