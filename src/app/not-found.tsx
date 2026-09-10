"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-8 rounded-2xl shadow-xl shadow-zinc-200/50 space-y-6">
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 mx-auto shadow-xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-zinc-900 leading-tight font-display">404 - Page Not Found</h2>
          <p className="text-xs text-zinc-550 leading-relaxed">
            The page you are looking for does not exist, has been moved, or is under active draft layout state.
          </p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-750 text-white font-bold py-3 rounded-xl text-xs shadow-sm shadow-violet-600/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
