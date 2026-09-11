'use client';

import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { UserDocumentVerificationWorkstation } from '../../components/verification';

export default function VerificationPage() {
  const { isAdmin, isVerifier, isOfficer } = useAuth();

  return (
    <AppLayout>
      <UserDocumentVerificationWorkstation canVerify={isAdmin || isVerifier || isOfficer} />
    </AppLayout>
  );
}
