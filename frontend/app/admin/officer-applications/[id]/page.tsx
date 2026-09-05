import React from 'react';
import OfficerApplicationReviewClient from './OfficerApplicationReviewClient';

// Required for Next.js static export (output: 'export')
export function generateStaticParams() {
  return [
    { id: 'OFF-APP-001' },
    { id: 'OFF-APP-002' },
    { id: 'OFF-APP-003' },
    { id: 'default' },
  ];
}

export default function OfficerApplicationReviewPage({
  params,
}: {
  params: { id: string };
}) {
  return <OfficerApplicationReviewClient applicationId={params.id} />;
}
