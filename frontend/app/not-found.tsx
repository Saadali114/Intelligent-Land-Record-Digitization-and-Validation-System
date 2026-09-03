'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">404 &mdash; Record Not Found</h1>
      <p className="mt-2 text-xs text-slate-600 max-w-md">
        The requested portal page or document resource could not be located in the digital registry.
      </p>

      <div className="mt-6">
        <Link href="/dashboard">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
