'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLandRecordsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/land-records');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-500 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to Official Cadastral Land Records...</span>
      </div>
    </div>
  );
}
