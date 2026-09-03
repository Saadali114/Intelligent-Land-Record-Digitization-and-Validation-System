'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        403 &mdash; Access Restricted
      </h1>

      <p className="mt-2 text-xs text-slate-600 max-w-md">
        Your current role ({user?.role || 'Guest'}) does not have sufficient permissions to access this
        department resource. Contact your system administrator to request elevated role privileges.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
