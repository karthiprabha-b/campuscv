"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login?mode=signup');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading CampusCV Registration...</p>
      </div>
    </div>
  );
}
