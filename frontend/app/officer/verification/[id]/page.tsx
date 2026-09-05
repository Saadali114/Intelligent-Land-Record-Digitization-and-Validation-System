import React from 'react';
import { AppLayout } from '../../../../components/layout/AppLayout';
import { OfficerVerificationWorkspace } from '../../../../components/officer-verification/OfficerVerificationWorkspace';
import {
  verificationWorkflowService,
} from '../../../../services/verificationWorkflowService';

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

export default function OfficerDetailAliasPage({ params }: PageProps) {
  const workflow =
    verificationWorkflowService.getWorkflowById(params.id) ||
    verificationWorkflowService.getPreset('CASE_1_GREEN');

  return (
    <AppLayout>
      <OfficerVerificationWorkspace initialWorkflow={workflow} />
    </AppLayout>
  );
}
