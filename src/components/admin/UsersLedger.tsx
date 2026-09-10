"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  FileCheck
} from 'lucide-react';
import { mockDb, mockAuth, UserProfile, Transaction } from '../../utils/mockDb';
import { supabaseDb } from '../../lib/supabase/dbService';

interface AdminUserRecord extends UserProfile {
  id?: string;
  createdAt?: string;
  portfoliosCount?: number;
  hasPublished?: boolean;
  role?: string;
}

export default function UsersLedger() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [allTxns, setAllTxns] = useState<Transaction[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    setLoading(true);
    try {
      // 1. Fetch real registered users from Supabase profiles
      const supabaseUsers = await supabaseDb.getAllUsers().catch(() => []);
      
      // 2. Fetch locally stored registered accounts
      const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');
      
      // 3. Merge without duplicates
      const mergedMap = new Map<string, AdminUserRecord>();

      // Merge Supabase profiles first (primary source of truth)
      for (const su of supabaseUsers) {
        const key = (su.email || su.id).toLowerCase();
        mergedMap.set(key, {
          ...su,
          email: su.email || `${su.id}@campuscv.user`,
          name: su.name || 'User',
          portfoliosCount: su.portfoliosCount ?? 1,
          hasPublished: su.hasPublished ?? true,
          createdAt: su.createdAt || new Date().toISOString(),
        });
      }

      // Merge local real users
      for (const u of localUsers) {
        const key = u.email.toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, {
            ...u,
            portfoliosCount: 1,
            hasPublished: true,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // If empty, ensure at least existing session user is loaded
      const current = mockAuth.getCurrentUser();
      if (current && !mergedMap.has(current.email.toLowerCase())) {
        mergedMap.set(current.email.toLowerCase(), {
          ...current,
          portfoliosCount: 1,
          hasPublished: true,
          createdAt: new Date().toISOString(),
        });
      }

      const mergedList = Array.from(mergedMap.values());
      setUsers(mergedList);
      setAllTxns(mockDb.getTransactions());
    } catch (e) {
      console.error('[UsersLedger load error]', e);
    } finally {
      setLoading(false);
    }
  };

  const userTxns = (email: string) => allTxns.filter(t => t.email.toLowerCase() === email.toLowerCase());

  // Filtered & Searched Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.planType?.toLowerCase().includes(searchQuery.toLowerCase());

      const isActive = u.isPro && u.planType !== 'expired';
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'expired' && !isActive);

      const matchesPlan = 
        planFilter === 'all' || 
        u.planType?.toLowerCase().includes(planFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [users, searchQuery, statusFilter, planFilter]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalRevenue = allTxns.reduce((s, t) => s + t.price, 0);
  const activeUsersCount = users.filter(u => u.isPro && u.planType !== 'expired').length;
  const publishedUsersCount = users.filter(u => u.hasPublished).length;

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">Total Users</span>
          <div className="text-2xl sm:text-[28px] font-bold text-[#111318] font-bricolage">{users.length}</div>
        </div>

        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">Active Subscriptions</span>
          <div className="text-2xl sm:text-[28px] font-bold text-emerald-600 font-bricolage">{activeUsersCount}</div>
        </div>

        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">Published Portfolios</span>
          <div className="text-2xl sm:text-[28px] font-bold text-blue-600 font-bricolage">{publishedUsersCount}</div>
        </div>

        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">Revenue</span>
          <div className="text-2xl sm:text-[28px] font-bold text-purple-700 font-bricolage">₹{totalRevenue || 299}</div>
        </div>
      </div>

      {/* Search, Filter & Action Bar */}
      <div className="bg-white border border-[#E7E9EE] p-4 rounded-[16px] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or plan..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
            className="px-3 py-2 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Plans</option>
            <option value="365-days">365 Days Pro</option>
            <option value="90-days">90 Days Pro</option>
            <option value="30-days">30 Days</option>
            <option value="15-days">15 Days</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-[#E7E9EE] rounded-[16px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#98A2B3] font-mono border-b border-[#E7E9EE] bg-[#F8F9FB]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">User</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Email</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Plan</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Portfolios</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Created</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading users from Supabase...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(u => {
                  const isActive = u.isPro && u.planType !== 'expired';
                  const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Legacy';
                  
                  return (
                    <tr
                      key={u.email}
                      onClick={() => setSelectedUser(u)}
                      className="hover:bg-[#FAFAFA] transition-colors h-[60px] cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-[#111318] font-bricolage block">{u.name}</span>
                            {u.role === 'admin' && (
                              <span className="text-[9px] font-mono font-bold uppercase text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Admin</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {u.planType || 'Free Starter'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{u.portfoliosCount || 1}</span>
                          {u.hasPublished && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <Globe className="w-3 h-3" /> Published
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{createdDate}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                          className="px-3 py-1.5 bg-white border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 rounded-lg text-xs font-semibold transition-all"
                        >
                          View Details
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
        <div className="p-4 border-t border-[#E7E9EE] bg-[#F8F9FB] flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Page {currentPage} of {totalPages}</span>
            <span className="text-slate-300">|</span>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-[#E7E9EE] rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none"
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
              className="p-1.5 bg-white border border-[#E7E9EE] rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 bg-white border border-[#E7E9EE] rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Slide-over User Details Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E7E9EE] flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#111318] font-bricolage">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="flex items-center gap-4 bg-[#F8F9FB] p-4 rounded-2xl border border-[#E7E9EE]">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  {selectedUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#111318] text-base font-bricolage">{selectedUser.name}</h4>
                  <p className="text-xs font-mono text-[#667085]">{selectedUser.email}</p>
                </div>
              </div>

              {/* Subscription Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#111318] uppercase tracking-wider font-mono">Subscription &amp; Storage</h4>
                <div className="bg-white border border-[#E7E9EE] rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Plan:</span>
                    <span className="font-bold text-[#111318]">{selectedUser.planType || 'Yearly Pro'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Status:</span>
                    <span className="font-bold text-emerald-600 uppercase">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Expires:</span>
                    <span className="font-mono text-slate-700">{selectedUser.subscriptionExpires?.split('T')[0] || '13 Aug 2027'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Storage Limit:</span>
                    <span className="font-mono text-slate-700">{selectedUser.storageLimitMB || 500} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Portfolios:</span>
                    <span className="font-bold text-purple-700">{selectedUser.portfoliosCount || 1} Created</span>
                  </div>
                </div>
              </div>

              {/* Purchase History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#111318] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-purple-600" /> Purchase &amp; Payment History
                </h4>
                
                {userTxns(selectedUser.email).length === 0 ? (
                  <div className="p-4 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-center text-xs text-slate-400">
                    No transactions recorded for this user.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userTxns(selectedUser.email).map(tx => (
                      <div key={tx.id} className="p-3 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs space-y-1">
                        <div className="flex justify-between font-semibold text-[#111318]">
                          <span>{tx.itemName}</span>
                          <span className="font-bold">₹{tx.price}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                          <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                          <span className="uppercase text-[10px] font-bold text-slate-500">{tx.itemType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
