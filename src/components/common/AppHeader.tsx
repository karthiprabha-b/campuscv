"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import CampusCvLogo from './CampusCvLogo';
import { mockAuth, UserProfile } from '../../utils/mockDb';
import { supabase } from '../../lib/supabase/client';

export default function AppHeader() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const localUser = mockAuth.getCurrentUser();
      if (localUser) {
        setCurrentUser(localUser);
        return;
      }
      try {
        const { data: { user: suUser } } = await supabase.auth.getUser();
        if (suUser) {
          const isAdmin = suUser.email?.toLowerCase().includes('campuscv.in') || suUser.email?.toLowerCase() === 'admin@campuscv.in';
          setCurrentUser({
            id: suUser.id,
            email: suUser.email || '',
            name: suUser.user_metadata?.full_name || suUser.user_metadata?.name || 'User',
            isPro: Boolean(isAdmin),
            planType: isAdmin ? '365-days' : 'free',
            storageLimitMB: 500
          });
          return;
        }
      } catch {}
      setCurrentUser(null);
    };

    checkUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CampusCvLogo className="h-8 sm:h-9 w-auto" />
          </Link>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/templates"
            className="text-sm font-semibold text-slate-700 hover:text-purple-600 transition-colors"
          >
            Templates
          </Link>
          {currentUser ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-purple-700 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-purple-600 transition-colors px-2 py-1"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-purple-700 transition-all"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
