import React from 'react';
import { CitizenVerificationWorkspace } from '../../../../components/citizen-verification/CitizenVerificationWorkspace';

export function generateStaticParams() {
  return [
    { id: 'CASE-001-GREEN' },
    { id: 'CASE-002-YELLOW' },
    { id: 'CASE-003-RED' },
    { id: 'CASE_1_GREEN' },
    { id: 'CASE_2_YELLOW' },
    { id: 'CASE_3_RED' },
  ];
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function CitizenVerificationDetailPage({ params }: PageProps) {
  return <CitizenVerificationWorkspace id={params.id} />;
}
