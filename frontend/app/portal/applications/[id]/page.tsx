import React from 'react';
import ApplicationDetailClient from './ApplicationDetailClient';

export function generateStaticParams() {
  return [
    { id: 'ILRDVS-2026-000124' },
    { id: 'ILRDVS-2026-000098' },
    { id: 'ILRDVS-2026-000075' },
    { id: 'ILRDVS-2026-000125' },
  ];
}

export default function ApplicationDetailPage() {
  return <ApplicationDetailClient />;
}
