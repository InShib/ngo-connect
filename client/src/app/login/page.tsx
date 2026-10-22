'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api, setStoredUser } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setStoredUser(res.data.user, res.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email: roleEmail, password: rolePass });
      if (res.data.success) {
        setStoredUser(res.data.user, res.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/20">
            <Heart className="w-6 h-6 fill-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to NGO CONNECT</h1>
          <p className="text-xs text-slate-400">Access your role dashboard, campaigns, and donation history</p>
        </div>

        {/* Demo Quick Logins */}
        <div className="glass-card p-4 space-y-2 border-emerald-500/30">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider text-center">
            🚀 Quick Demo Login Accounts
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('admin@ngoconnect.org', 'admin123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-left font-medium"
            >
              👑 Admin Demo
            </button>
            <button
              onClick={() => handleDemoLogin('contact@greenearth.org', 'ngo123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-left font-medium"
            >
              🏢 NGO Demo
            </button>
            <button
              onClick={() => handleDemoLogin('priya.vol@gmail.com', 'vol123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-left font-medium"
            >
              🙋 Volunteer Demo
            </button>
            <button
              onClick={() => handleDemoLogin('aarav.donor@gmail.com', 'donor123')}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-left font-medium"
            >
              💳 Donor Demo
            </button>
          </div>
        </div>

        <div className="glass-panel p-8 space-y-6">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="glass-input pl-10 text-xs w-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-emerald-400 hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input pl-10 text-xs w-full"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-xs font-bold">
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline">Register now</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
