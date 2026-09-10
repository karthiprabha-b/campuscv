"use client";

import React from 'react';
import Link from 'next/link';
import CampusCvLogo from './CampusCvLogo';
import { getMarketingUrl } from '../../utils/urlHelper';

export default function AppFooter() {
  const marketingUrl = getMarketingUrl();

  return (
    <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <CampusCvLogo variant="white" className="h-6 w-auto" />
          <span>&copy; {new Date().getFullYear()} CampusCV. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/templates" className="hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <a href={`${marketingUrl}/pricing`} className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href={`${marketingUrl}/about`} className="hover:text-white transition-colors">
            About
          </a>
          <a href={`${marketingUrl}/contact`} className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
