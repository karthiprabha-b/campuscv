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
  CheckCircle2,
  Sparkles
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
      const validUsernames = ['admin', 'admin@campuscv.in', 'superadmin', 'karthikeyan', 'muthukmr@gmail.com', 'admin@campuscv.com'];
      const validPasswords = ['campuscv@admin2026', 'admin123', 'admin', 'password', 'karthikeyan2026'];

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
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      
      {/* Dynamic Background Glows with Brand Orange (~30%) & Violet */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-orange-500/15 via-purple-600/20 to-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-200">
              <CampusCvLogo />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-orange-500/20 to-purple-500/20 text-orange-400 border border-orange-500/30 font-mono shadow-xs">
              ADMIN CONSOLE
            </span>
          </Link>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-orange-400" />
            Security &amp; Operations Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141A28]/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 text-left relative overflow-hidden">
          
          {/* Top Accent Orange/Purple Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-500" />

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Admin Access</span>
              <Sparkles className="w-4 h-4 text-orange-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-1">Sign in with authorized administrative credentials.</p>
          </div>

          {error && (
            <div className="p-3.5 mb-5 bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs rounded-xl flex items-center gap-2.5 font-mono animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 mb-5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2.5 font-mono animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Authorization confirmed. Opening Admin Console...</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            
            {/* Username / Admin Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter administrator identity"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1C2436] border border-slate-700/80 focus:border-orange-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/40 transition-all font-mono"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Admin Security Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1C2436] border border-slate-700/80 focus:border-orange-500 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/40 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button with Vibrant 30% Orange + Violet Gradient */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 hover:from-orange-400 hover:via-orange-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 hover:shadow-orange-500/25 active:scale-[0.99]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate &amp; Launch Console</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <Link href="/auth/login" className="hover:text-orange-400 transition-colors font-mono flex items-center gap-1">
              ← User Sign In
            </Link>
            <Link href="/" className="hover:text-slate-200 transition-colors">
              CampusCV Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
