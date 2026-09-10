"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight,
  MailCheck,
  RotateCcw
} from 'lucide-react';
import CampusCvLogo from '../../../components/common/CampusCvLogo';
import { initializeMockDb, mockAuth, UserProfile } from '../../../utils/mockDb';
import { supabase } from '../../../lib/supabase/client';

function ForgotPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeMockDb();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const getRedirectUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/auth/callback?next=/auth/reset-password`;
    }
    const base = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '') : 'https://campuscv.in';
    return `${base}/auth/callback?next=/auth/reset-password`;
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const redirectUrl = getRedirectUrl();

      // Call Supabase Auth password reset
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resetErr) {
        // If Supabase returns rate limit or other error
        if (resetErr.message?.toLowerCase().includes('rate limit')) {
          setError('Too many requests. Please wait a minute before trying again.');
        } else {
          setError(resetErr.message || 'Failed to send password reset email.');
        }
        setLoading(false);
        return;
      }

      setEmailSent(true);
      setCooldown(60);
      setMessage(`We've sent a secure password reset link to ${email.trim()}.`);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    setError('');
    setMessage('');

    try {
      const redirectUrl = getRedirectUrl();

      const { error: resendErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resendErr) {
        setError(resendErr.message || 'Could not resend email. Please try again later.');
      } else {
        setMessage('A new password reset link has been sent to your email.');
        setCooldown(60);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend email.');
    } finally {
      setResending(false);
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
        
        {emailSent ? (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100 shadow-xs">
              <MailCheck className="w-8 h-8 stroke-[1.75]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 font-bricolage tracking-tight">
                Check Your Email
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                We sent a secure password reset link to <strong className="text-slate-900">{email}</strong>.
              </p>
            </div>

            {message && (
              <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-2.5 font-medium text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-red-50/90 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 font-medium text-left">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 space-y-1 text-left">
              <p className="font-semibold text-slate-800">What to do next:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500">
                <li>Open your inbox and click the reset password button.</li>
                <li>If you don&apos;t see the email, check your <strong>Spam</strong> or <strong>Junk</strong> folder.</li>
                <li>The reset link will automatically log you in to create a new password.</li>
              </ul>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {resending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    <span>Resending...</span>
                  </>
                ) : cooldown > 0 ? (
                  <span>Resend link in {cooldown}s</span>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend Reset Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setEmailSent(false); setError(''); setMessage(''); }}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
              >
                Try a different email address
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-bricolage tracking-tight">
                Reset Account Password
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered email address and we&apos;ll send you a secure link to reset your password.
              </p>
            </div>

            {error && (
              <div className="p-3.5 mb-4 bg-red-50/90 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Your Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-600/10 transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Password Reset Link</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />
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

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-purple-500 selection:text-white font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-400/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-indigo-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Suspense fallback={
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        }>
          <ForgotPasswordContent />
        </Suspense>
      </div>

      <div className="text-center text-xs text-slate-400 font-medium mt-8 relative z-10">
        &copy; {new Date().getFullYear()} CampusCV. All rights reserved.
      </div>
    </div>
  );
}
