"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockAuth } from '../utils/mockDb';
import { supabase } from '../lib/supabase/client';

export default function RootAppRedirect() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const routeUser = async () => {
      // 1. Check local session
      const localUser = mockAuth.getCurrentUser();
      if (localUser) {
        if (isMounted) router.replace('/dashboard');
        return;
      }

      // 2. Check Supabase auth session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          if (isMounted) router.replace('/dashboard');
          return;
        }
      } catch (err) {
        console.warn('[CampusCV App Router] Session check error:', err);
      }

      // 3. Fallback: redirect to login
      if (isMounted) {
        router.replace('/auth/login');
      }
    };

    routeUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-white p-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-wide text-slate-200">Opening CampusCV...</p>
          <p className="text-xs text-slate-500 font-mono">portfolio.campuscv.com</p>
        </div>
      </div>
    </div>
  );
}
