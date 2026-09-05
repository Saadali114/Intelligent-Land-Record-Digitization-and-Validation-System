'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * ============================================================================
 * QueryProvider — Central Data Cache & Queue Connection
 * ============================================================================
 * 
 * WHAT THIS DOES:
 * 1. Global Cache Manager:
 *    Stores data fetched from the backend (like Land Records, Verification Queue,
 *    and Audit History) in memory so pages load instantly without redundant API calls.
 * 
 * 2. How it Connects to the Verification Queue:
 *    - The Verification Queue (`useVerificationRecordsQuery` in `useVerification.ts`)
 *      uses query key: `['verification-queue']`.
 *    - When an officer takes an action (Approve / Reject / Correct), the mutation
 *      calls `queryClient.invalidateQueries(['verification-queue'])`.
 *    - QueryProvider automatically detects this invalidation and re-fetches the latest
 *      queue records in the background without requiring a page reload!
 * 
 * 3. Configuration:
 *    - staleTime (60s): Keeps queue data fresh for 1 minute before refetching.
 *    - refetchOnWindowFocus: Disabled to prevent jarring reloads during reviews.
 *    - retry (1): Retries failed network requests once before showing an error.
 */

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState ensures QueryClient instance remains stable across re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // Keep data cached for 1 minute
            refetchOnWindowFocus: false, // Don't refetch automatically when switching browser tabs
            retry: 1, // Automatically retry once on network glitch
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
