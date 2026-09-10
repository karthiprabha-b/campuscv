"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import CampusCvLogo from '../../../components/common/CampusCvLogo';
import { initializeMockDb, mockAuth, UserProfile } from '../../../utils/mockDb';
import { supabase } from '../../../lib/supabase/client';

function ResetPasswordContent() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    initializeMockDb();

    // Check if recovery session is active
    const verifyRecoverySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          setHasValidSession(true);
          setUserEmail(session.user.email || '');
          setCheckingSession(false);
          return;
        }

        // Check if hash has access token
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        if (hash.includes('access_token') || hash.includes('type=recovery')) {
          setHasValidSession(true);
          setCheckingSession(false);
          return;
        }

        // If no session found yet, give listener a moment
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession && retrySession.user) {
            setHasValidSession(true);
            setUserEmail(retrySession.user.email || '');
          } else {
            setHasValidSession(false);
          }
          setCheckingSession(false);
        }, 1000);
      } catch (err) {
        console.warn('[Session check error]', err);
        setCheckingSession(false);
      }
    };

    verifyRecoverySession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && session.user)) {
        setHasValidSession(true);
        if (session?.user?.email) setUserEmail(session.user.email);
        setCheckingSession(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. Update password in Supabase Auth
      const { data, error: suError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (suError) {
        setError(suError.message || 'Failed to update password.');
        setLoading(false);
        return;
      }

      const updatedEmail = data.user?.email || userEmail;

      // 2. Sync to local storage
      if (updatedEmail) {
        const users: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');
        const idx = users.findIndex(u => u.email.toLowerCase() === updatedEmail.toLowerCase());
        if (idx !== -1) {
          users[idx].password = newPassword;
          localStorage.setItem('portly_users', JSON.stringify(users));
        }

        const currentUser = mockAuth.getCurrentUser();
        if (currentUser && currentUser.email.toLowerCase() === updatedEmail.toLowerCase()) {
          currentUser.password = newPassword;
          localStorage.setItem('portly_current_user', JSON.stringify(currentUser));
        }
      }

      setMessage('🎉 Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login?reset=true');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto relative z-10 font-sans">
      
      {/* Brand Header */}
      <div className="text-center mb-7 flex flex-col items-center justify-center gap-3">
        <Link href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
          <CampusCvLogo className="h-13 sm:h-15 w-auto max-w-[280px] sm:max-w-[320px] object-contain shrink-0 drop-shadow-sm select-none" />
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-purple-900/5 transition-all text-left">
        
        {checkingSession ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Verifying secure recovery link...</p>
          </div>
        ) : !hasValidSession ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-bricolage">Reset Link Expired or Invalid</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                This password reset link is invalid or has expired. For your security, reset links can only be used once.
              </p>
            </div>
            <Link
              href="/auth/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Request a New Reset Link</span>
            </Link>
            <div className="pt-2">
              <Link href="/auth/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                &larr; Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-bricolage tracking-tight">
                Create New Password
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {userEmail ? `Enter a new secure password for ${userEmail}.` : 'Please choose a strong new password for your account.'}
              </p>
            </div>

            {/* Error & Message Alerts */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-5 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 font-medium animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-600/10 transition-all"
                    required
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-600/10 transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Update Password &amp; Login</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
              <Link
                href="/auth/login?mode=signup"
                className="text-purple-600 hover:text-purple-700"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-400/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-indigo-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Suspense fallback={
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>

      <div className="text-center text-xs text-slate-400 font-medium mt-8 relative z-10">
        &copy; {new Date().getFullYear()} CampusCV. All rights reserved.
      </div>
    </div>
  );
}
