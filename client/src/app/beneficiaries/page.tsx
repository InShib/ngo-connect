'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Plus, ShieldCheck, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { api, getStoredUser } from '@/lib/api';

export default function BeneficiariesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    category: 'food',
    description: '',
    urgencyLevel: 'high',
    street: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    setUser(getStoredUser());
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/beneficiaries');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to submit an assistance request.');

    try {
      const res = await api.post('/beneficiaries', {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        urgencyLevel: formData.urgencyLevel,
        location: {
          street: formData.street,
          city: formData.city,
          state: 'Delhi',
          pincode: '110001',
        },
        contactPhone: formData.phone,
      });

      if (res.data.success) {
        setShowModal(false);
        fetchRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Heart className="w-4 h-4" />
            <span>Direct Beneficiary Assistance & Triage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Beneficiary Request <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg">
            Are you or someone you know in need of food, medical kits, shelter, or education support? Submit a verified request to local NGOs.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary py-3.5 px-6 text-xs shrink-0">
          <Plus className="w-4 h-4" />
          <span>Request Relief Assistance</span>
        </button>
      </div>

      {/* Requests Listing Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading assistance requests...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="glass-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-bold uppercase">
                    {req.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      req.urgencyLevel === 'critical' || req.urgencyLevel === 'high'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {req.urgencyLevel} Urgency
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{req.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3">{req.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
                <span className="capitalize">Status: <strong className="text-emerald-400">{req.status}</strong></span>
                <span>City: {req.location?.city || 'Delhi'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REQUEST MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Submit Assistance Request</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Request Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Urgent Ration & Warm Clothes Needed for 5 Families"
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass-input w-full bg-slate-900"
                  >
                    <option value="food">Food & Ration</option>
                    <option value="medical">Medical Assistance</option>
                    <option value="clothing">Clothing & Blankets</option>
                    <option value="shelter">Emergency Shelter</option>
                    <option value="education">School Supplies</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Urgency Level</label>
                  <select
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                    className="glass-input w-full bg-slate-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical Emergency</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Details / Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your situation..."
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New Delhi"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Contact Phone</label>
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

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1 py-3 text-xs font-bold">
                  Submit Request
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-3 text-xs">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
