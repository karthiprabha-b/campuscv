"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#24005F] text-white flex items-center justify-center font-dm-sans">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#F69060] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-space-mono text-white/80 font-bold">Redirecting to CampusCV Login...</p>
      </div>
    </div>
  );
}
