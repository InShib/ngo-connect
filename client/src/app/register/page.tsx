'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, User, Mail, Lock, Building2, Phone, MapPin, ArrowRight } from 'lucide-react';
import { api, setStoredUser } from '@/lib/api';

export default function RegisterPage() {
  const [role, setRole] = useState<'donor' | 'ngo' | 'volunteer' | 'beneficiary'>('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    organizationName: '',
    registrationNumber: '',
    mission: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { ...formData, role });
      if (res.data.success) {
        setStoredUser(res.data.user, res.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mx-auto">
            <Heart className="w-6 h-6 fill-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-white">Create your Account</h1>
          <p className="text-xs text-slate-400">Join NGO CONNECT to donate, volunteer, or digitize your non-profit</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold">
          {[
            { id: 'donor', label: 'Donor' },
            { id: 'volunteer', label: 'Volunteer' },
            { id: 'ngo', label: 'NGO' },
            { id: 'beneficiary', label: 'Beneficiary' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id as any)}
              className={`py-2 rounded-lg transition-all ${
                role === r.id ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="glass-panel p-8 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Name / Contact Person</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aarav Sharma"
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aarav@example.com"
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">City / Region</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New Delhi"
                className="glass-input w-full"
              />
            </div>

            {/* Extra inputs for NGO Role */}
            {role === 'ngo' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">NGO Organization Name</label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="Green Earth Foundation"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Registration Certificate Number (12A/80G)</label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="REG-2026-XXXX"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Mission Statement</label>
                  <textarea
                    rows={2}
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    placeholder="Empowering local communities with clean energy..."
                    className="glass-input w-full"
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-xs font-bold mt-2">
              {loading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">Sign in instead</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
