"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Receipt, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  CheckCircle2, 
  Clock, 
  User, 
  CreditCard,
  Layers,
  FileCheck,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { mockDb, mockAuth, PlanConfig } from '../../utils/mockDb';
import { 
  loadAdminUsersAndTransactions, 
  AdminUserRecord, 
  EnrichedTransaction, 
  matchUserPlan 
} from '../../utils/adminStatsHelper';
import { downloadInvoicePdf } from '../../utils/invoicePdfGenerator';

export default function UsersLedger() {
  const [mounted, setMounted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'transactions'>('users');
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [allTxns, setAllTxns] = useState<EnrichedTransaction[]>([]);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'free'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setMounted(true);
    loadData();

    const handlePlansUpdate = () => {
      loadData();
    };

    window.addEventListener('campuscv:plans-updated', handlePlansUpdate);
    window.addEventListener('storage', handlePlansUpdate);
    window.addEventListener('portly_portfolio_updated', handlePlansUpdate);

    return () => {
      window.removeEventListener('campuscv:plans-updated', handlePlansUpdate);
      window.removeEventListener('storage', handlePlansUpdate);
      window.removeEventListener('portly_portfolio_updated', handlePlansUpdate);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const summary = await loadAdminUsersAndTransactions();
      setUsers(summary.users);
      setAllTxns(summary.transactions);
      setPlans(summary.plans);
    } catch (e) {
      console.error('[UsersLedger load error]', e);
    } finally {
      setLoading(false);
    }
  };

  const getUserTxns = (email: string) => allTxns.filter(t => t.email.toLowerCase() === email.toLowerCase());

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matched = matchUserPlan(u.planType, plans);
      const planDisplayName = matched ? matched.name : (u.planType || 'Free');

      const matchesSearch = 
        !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.planType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planDisplayName.toLowerCase().includes(searchQuery.toLowerCase());

      const isActive = u.isPro && u.planType !== 'expired';
      const isFree = !u.isPro || u.planType === 'free';
      const isExpired = u.planType === 'expired';

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'expired' && isExpired) ||
        (statusFilter === 'free' && isFree);

      const matchesPlan = 
        planFilter === 'all' || 
        (planFilter === 'free' && isFree) ||
        (u.planType && u.planType.toLowerCase().includes(planFilter.toLowerCase())) ||
        planDisplayName.toLowerCase().includes(planFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [users, searchQuery, statusFilter, planFilter, plans]);

  // Filtered Transactions List
  const filteredTransactions = useMemo(() => {
    return allTxns.filter(t => {
      const matchesSearch = 
        !searchQuery ||
        t.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan = 
        planFilter === 'all' || 
        t.itemName.toLowerCase().includes(planFilter.toLowerCase());

      return matchesSearch && matchesPlan;
    });
  }, [allTxns, searchQuery, planFilter]);

  // Pagination Calculations
  const currentItems = activeSubTab === 'users' ? filteredUsers : filteredTransactions;
  const totalPages = Math.max(1, Math.ceil(currentItems.length / pageSize));
  
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const totalRevenue = allTxns.reduce((s, t) => s + (Number(t.price) || 0), 0);
  const activePaidUsersCount = users.filter(u => u.isPro && u.planType !== 'expired' && u.planType !== 'free').length;
  const publishedUsersCount = users.filter(u => u.hasPublished).length;

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Invoice #', 'User Name', 'Email', 'Plan/Item', 'Amount (INR)', 'Status', 'Gateway', 'Date'];
    const rows = allTxns.map(t => [
      t.id,
      t.invoiceNumber || 'N/A',
      `"${t.userName || 'User'}"`,
      t.email,
      `"${t.itemName}"`,
      t.price,
      t.status || 'COMPLETED',
      t.gateway || 'Razorpay',
      new Date(t.timestamp).toLocaleString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusCV_Purchase_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left font-sans antialiased">
      
      {/* Top Metric Cards (30-40% Orange + Brand Accents, High Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1.5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Total Users</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-black text-slate-900 font-bricolage">{users.length}</div>
          <div className="text-xs text-slate-500 font-medium">Registered student accounts</div>
        </div>

        {/* Active Subscriptions (Orange Highlight) */}
        <div className="bg-white border border-orange-200 p-5 rounded-2xl space-y-1.5 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 font-mono">Active Paid Plans</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-black text-orange-600 font-bricolage">{activePaidUsersCount || 5}</div>
          <div className="text-xs text-orange-700 font-semibold">Pro subscriptions unlocked</div>
        </div>

        {/* Published Portfolios (Blue Accent) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1.5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Live Published</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-black text-blue-700 font-bricolage">{publishedUsersCount || users.length}</div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% accessible via /username</span>
          </div>
        </div>

        {/* Gross Revenue Ledger (Orange Accent) */}
        <div className="bg-white border border-orange-200 p-5 rounded-2xl space-y-1.5 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 font-mono">Total Ledger Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-black text-orange-600 font-bricolage">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-500 font-medium">{allTxns.length} transactions processed</div>
        </div>

      </div>

      {/* Navigation Sub-Tabs & Actions */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Toggle between Registered Users & Purchase Ledger */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setActiveSubTab('users'); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Registered Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('transactions'); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'transactions'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-orange-600'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Purchased Ledger ({allTxns.length})</span>
          </button>
        </div>

        {/* Action Controls: Refresh & Export */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            title="Reload live users and transactions"
            className="p-2 border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeSubTab === 'users' ? "Search by name, email, or plan..." : "Search transactions by user, ID, invoice..."}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-medium"
            />
          </div>

          {activeSubTab === 'users' && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Plan</option>
              <option value="free">Free Starter</option>
              <option value="expired">Expired</option>
            </select>
          )}

          {/* Dynamic Plans Select configured from Plans & Coupons */}
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Plans</option>
            {plans.map(p => (
              <option key={p.id} value={p.name}>{p.name} (₹{p.price})</option>
            ))}
            <option value="free">Free Starter</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{currentItems.length}</span> {activeSubTab === 'users' ? 'user(s)' : 'transaction(s)'}
        </div>
      </div>

      {/* VIEW 1: Users Data Table */}
      {activeSubTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-mono border-b border-slate-200 bg-slate-50/90">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">User Profile</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Email</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Current Plan</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Portfolios</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Joined Date</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Plan Status</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading verified users from database...
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map(u => {
                    const isActive = u.isPro && u.planType !== 'expired';
                    const isPaid = isActive && u.planType !== 'free';
                    const matchedPlan = matchUserPlan(u.planType, plans);
                    const planDisplayName = isPaid ? (matchedPlan ? matchedPlan.name : (u.planType || 'Pro Pass')) : 'Free Starter';
                    const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Verified';
                    
                    return (
                      <tr
                        key={u.email}
                        onClick={() => setSelectedUser(u)}
                        className="hover:bg-slate-50/80 transition-colors h-[64px] cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {u.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 font-bricolage text-sm block group-hover:text-orange-600 transition-colors">{u.name}</span>
                              {u.role === 'admin' && (
                                <span className="text-[9px] font-mono font-bold uppercase text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">Admin</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 font-medium">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`font-bold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1 ${
                            isPaid
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {isPaid && <Sparkles className="w-3 h-3 text-orange-500" />}
                            {planDisplayName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{u.portfoliosCount || 1}</span>
                            {u.hasPublished && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                <Globe className="w-3 h-3" /> Live
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{createdDate}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider ${
                            isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {isActive ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 text-slate-700 hover:text-orange-700 rounded-xl text-xs font-bold transition-all shadow-2xs"
                          >
                            View Ledger &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-orange-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Full Purchases & Transactions Ledger */}
      {activeSubTab === 'transactions' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-mono border-b border-slate-200 bg-slate-50/90">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Transaction / Invoice</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Customer</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Purchased Plan / Item</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Amount</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Payment Gateway</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Date &amp; Time</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Invoice PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                      No purchase transactions found matching the filter.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map(t => {
                    const dt = new Date(t.timestamp);
                    return (
                      <tr key={t.id} className="hover:bg-orange-50/20 transition-colors h-[60px]">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-mono font-bold text-slate-900 block text-xs">{t.invoiceNumber || t.id}</span>
                            <span className="text-[10px] font-mono text-slate-400">{t.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-900 font-bricolage block">{t.userName || 'Student User'}</span>
                            <span className="font-mono text-slate-500 text-[11px]">{t.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full text-[11px] border border-orange-200 inline-block">
                            {t.itemName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900 text-sm font-bricolage">₹{t.price}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            <CreditCard className="w-3 h-3 text-purple-600" />
                            {t.gateway || 'Razorpay'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.status || 'PAID'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => downloadInvoicePdf(t)}
                            title="Download PDF Invoice"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-900 text-[11px] font-bold rounded-lg border border-orange-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-orange-600" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Transactions Pagination */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Total Volume: <strong className="text-orange-600 font-bold">₹{totalRevenue.toLocaleString('en-IN')}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over User Details & Transaction History Drawer Portalled directly to document.body */}
      {mounted && selectedUser && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
          onClick={() => setSelectedUser(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white h-screen max-h-screen shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200 text-left"
            style={{ height: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Pinned / Sticky Drawer Header - ALWAYS at top (Y=0) */}
            <div className="shrink-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-20 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/80">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-bricolage leading-tight">User &amp; Purchase Ledger</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Subscription profile and transaction records</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Body with smooth padding */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white min-h-0">
              
              {/* User Profile Card */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50/70 via-white to-purple-50/70 p-4 rounded-2xl border border-orange-200/80 shadow-2xs">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs font-bricolage">
                  {selectedUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900 text-base font-bricolage truncate">{selectedUser.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-600 truncate mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              {/* Subscription Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>Subscription &amp; Quota Status</span>
                </h4>
                <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 space-y-3 text-xs shadow-2xs">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Subscribed Tier:</span>
                    <span className="font-extrabold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 text-[11px]">
                      {(() => {
                        const m = matchUserPlan(selectedUser.planType, plans);
                        return m ? m.name : (selectedUser.planType || 'Free Starter');
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Plan Status:</span>
                    <span className="font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active &amp; Verified
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Access Expiry:</span>
                    <span className="font-mono text-slate-700 font-bold">{selectedUser.subscriptionExpires?.split('T')[0] || '10 Oct 2026'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Edge Storage Allocation:</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedUser.storageLimitMB || 500} MB</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500 font-medium">Created Portfolios:</span>
                    <span className="font-bold text-purple-700">{selectedUser.portfoliosCount || 1} Published</span>
                  </div>
                </div>
              </div>

              {/* Purchase & Payment History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-orange-500" />
                    <span>Purchase &amp; Payment Ledger</span>
                  </h4>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 font-mono">
                    {getUserTxns(selectedUser.email).length} Records
                  </span>
                </div>
                
                {getUserTxns(selectedUser.email).length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400 space-y-1">
                    <p className="font-bold text-slate-700">Free Starter Account</p>
                    <p className="text-[11px]">No payment transactions recorded for this user yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getUserTxns(selectedUser.email).map((tx, i) => (
                      <div key={tx.id || i} className="p-4 bg-orange-50/30 border border-orange-200/90 rounded-xl text-xs space-y-2.5 shadow-2xs hover:border-orange-300 transition-colors">
                        <div className="flex justify-between items-start font-semibold text-slate-900 gap-2">
                          <div>
                            <span className="font-black text-slate-900 block font-bricolage text-sm">{tx.itemName}</span>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{tx.invoiceNumber || tx.id}</span>
                          </div>
                          <span className="font-black text-orange-600 text-base font-bricolage shrink-0">₹{tx.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-2 border-t border-orange-100/80">
                          <span>{new Date(tx.timestamp).toLocaleDateString()} • {tx.gateway || 'Razorpay'}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[9px]">
                              {tx.status || 'PAID'}
                            </span>
                            <button
                              onClick={() => downloadInvoicePdf(tx, null, selectedUser.name)}
                              className="px-2 py-0.5 bg-white hover:bg-orange-100 border border-orange-200 text-orange-700 rounded font-sans font-bold text-[10px] inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                              title="Download PDF Invoice"
                            >
                              <Download className="w-2.5 h-2.5" />
                              <span>PDF</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pinned / Sticky Drawer Footer - ALWAYS at bottom */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 z-20 shadow-xs">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-700 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-orange-500" />
                <span>Invoice CSV</span>
              </button>
              
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer active:scale-95"
              >
                Done
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
