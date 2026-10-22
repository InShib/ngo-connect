'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Heart,
  Users,
  Award,
  TrendingUp,
  FileText,
  Package,
  QrCode,
  CheckCircle2,
  XCircle,
  Plus,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { api, getStoredUser, clearStoredSession } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [ngoProfile, setNgoProfile] = useState<any>(null);
  const [userDonations, setUserDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchDashboardData(currentUser);
  }, []);

  const fetchDashboardData = async (currentUser: any) => {
    try {
      setLoading(true);
      if (currentUser.role === 'admin') {
        const res = await api.get('/admin/stats');
        if (res.data.success) setAdminStats(res.data.stats);
      } else if (currentUser.role === 'ngo') {
        const res = await api.get('/ngos/me');
        if (res.data.success) setNgoProfile(res.data.data);
      }

      // Fetch user's donations
      const donRes = await api.get('/donations/my');
      if (donRes.data.success) setUserDonations(donRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold capitalize">
                {user.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email} • Member since 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => fetchDashboardData(user)} className="btn-secondary py-2.5 px-4 text-xs">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* ADMIN DASHBOARD VIEW */}
      {user.role === 'admin' && (
        <div className="space-y-8">
          {/* Admin Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Registered Users</div>
              <div className="text-3xl font-black text-white">{adminStats?.totalUsers || 24}</div>
            </div>
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total NGOs</div>
              <div className="text-3xl font-black text-emerald-400">{adminStats?.totalNgos || 8}</div>
            </div>
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Active Campaigns</div>
              <div className="text-3xl font-black text-teal-400">{adminStats?.activeCampaigns || 12}</div>
            </div>
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Funds Processed</div>
              <div className="text-3xl font-black text-cyan-400">₹{(adminStats?.totalDonationVolume || 2480000).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">NGO Verification Queue</h3>
            <p className="text-xs text-slate-400">Review 12A/80G documents and approve NGO verification status.</p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Green Earth Foundation</div>
                <div className="text-slate-400">Reg: REG-2026-8891 • Delhi</div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                Verified Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* NGO DASHBOARD VIEW */}
      {user.role === 'ngo' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Funds Raised</div>
              <div className="text-3xl font-black text-emerald-400">₹8,45,000</div>
            </div>
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Active Campaigns</div>
              <div className="text-3xl font-black text-white">3 Campaigns</div>
            </div>
            <div className="glass-card p-6 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">Volunteers Assigned</div>
              <div className="text-3xl font-black text-teal-400">42 Volunteers</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/campaigns" className="btn-primary py-3 px-6 text-xs">
              <Plus className="w-4 h-4" />
              <span>Create New Campaign</span>
            </Link>
          </div>
        </div>
      )}

      {/* DONOR & GENERAL USER VIEW */}
      {(user.role === 'donor' || user.role === 'volunteer' || user.role === 'beneficiary') && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-400" /> My Contribution History
          </h2>

          {userDonations.length === 0 ? (
            <div className="glass-card p-8 text-center text-xs text-slate-400 space-y-2">
              <p>You haven't made any donations yet.</p>
              <Link href="/donate" className="btn-primary py-2.5 px-5 text-xs mx-auto w-fit">
                Make your first donation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userDonations.map((don) => (
                <div key={don._id} className="glass-card p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Receipt #{don.receiptNumber}</div>
                    <div className="text-slate-400">Type: {don.type?.toUpperCase()} • Status: {don.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">
                      {don.type === 'money' ? `₹${don.amount?.toLocaleString('en-IN')}` : `${don.items?.length || 1} Items`}
                    </div>
                    {don.type === 'money' && (
                      <a
                        href={`http://localhost:5000/api/v1/donations/receipt/${don._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-teal-400 underline hover:text-teal-300"
                      >
                        PDF Receipt
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
