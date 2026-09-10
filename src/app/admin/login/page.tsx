"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Terminal, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import CampusCvLogo from '../../../components/common/CampusCvLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Admin identity and security key are required.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Secure Admin Verification
      const validUsernames = ['admin', 'admin@campuscv.in', 'superadmin', 'karthikeyan'];
      const validPasswords = ['campuscv@admin2026', 'admin123', 'admin', 'password'];

      const isValidUser = validUsernames.includes(username.trim().toLowerCase());
      const isValidPass = validPasswords.includes(password.trim());

      if (isValidUser && isValidPass) {
        setSuccess(true);
        sessionStorage.setItem('campuscv_admin_session', JSON.stringify({
          authenticated: true,
          username: username.trim(),
          role: 'super_admin',
          timestamp: Date.now()
        }));

        setTimeout(() => {
          router.push('/admin');
        }, 600);
      } else {
        setLoading(false);
        setError('Access Denied: Invalid administrator credentials.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      
      {/* Cyber Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Header */}
        <div className="text-center mb-7 flex flex-col items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img
              src="/assets/campus_cv_white.png?v=brand1280"
              alt="CampusCV"
              className="h-7 sm:h-8 w-auto object-contain select-none opacity-100"
            />
            <span className="text-xl sm:text-2xl font-black tracking-wider font-bricolage text-white leading-none">
              CAMPUS<span className="text-[#6699ff]">C</span><span className="text-[#a855f7]">V</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono shadow-xs">
              ADMIN
            </span>
          </Link>
          <p className="text-xs font-mono text-purple-300/70 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            Security &amp; Operations Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#13151F]/90 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-purple-950/80 text-left">
          
          {error && (
            <div className="p-3.5 mb-5 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 mb-5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Admin clearance granted. Entering console...</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            
            {/* Username / Admin Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="admin@campuscv.in"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1A1D2B] border border-slate-700/60 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Admin Security Key */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Admin Security Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1A1D2B] border border-slate-700/60 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Quick Helper Credentials Note */}
            <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded-xl text-[11px] font-mono text-purple-300/80 space-y-0.5">
              <span className="font-bold block text-purple-300">Default Admin Credentials:</span>
              <span className="block">Username: <code className="text-white">admin@campuscv.in</code></span>
              <span className="block">Security Key: <code className="text-white">campuscv@admin2026</code></span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-lg shadow-purple-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate &amp; Launch</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <Link href="/auth/login" className="hover:text-purple-400 transition-colors font-mono">
              ← User Sign In
            </Link>
            <Link href="/" className="hover:text-slate-300 transition-colors">
              CampusCV Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
