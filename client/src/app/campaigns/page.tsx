'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, Filter, Plus, Sparkles, AlertCircle, Clock, Users, X } from 'lucide-react';
import { api, getStoredUser } from '@/lib/api';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // New Campaign Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    tagline: '',
    category: 'education',
    targetAmount: 100000,
    description: '',
    isUrgent: false,
  });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    fetchCampaigns();
  }, [search, category, isUrgent]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (isUrgent) params.isUrgent = 'true';

      const res = await api.get('/campaigns', { params });
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiDescription = async () => {
    if (!newCampaign.title) return alert('Please enter a campaign title first!');
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-campaign', {
        title: newCampaign.title,
        category: newCampaign.category,
        targetAmount: newCampaign.targetAmount,
      });
      if (res.data.success) {
        setNewCampaign((prev) => ({
          ...prev,
          description: res.data.generatedDescription,
          tagline: res.data.generatedTagline,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/campaigns', {
        ...newCampaign,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      if (res.data.success) {
        setShowCreateModal(false);
        fetchCampaigns();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create campaign. Only registered NGOs can post.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Fundraising & Relief Drives</div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Active Social <span className="gradient-text">Campaigns</span>
          </h1>
        </div>

        {user && user.role === 'ngo' && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary py-3 px-6 text-xs shrink-0">
            <Plus className="w-4 h-4" />
            <span>Launch New Campaign</span>
          </button>
        )}
      </div>

      {/* Search & Filter Panel */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by title or category..."
            className="glass-input pl-10 text-xs w-full py-2.5"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input py-2.5 text-xs bg-slate-900 text-slate-200 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="food_hunger">Food Security</option>
            <option value="disaster_relief">Disaster Relief</option>
            <option value="environment">Environment</option>
          </select>

          <button
            onClick={() => setIsUrgent(!isUrgent)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              isUrgent
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Urgent Only</span>
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading social campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 glass-card space-y-2">
          <div className="text-slate-400 text-base font-semibold">No campaigns match your filters</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.raisedAmount / (camp.targetAmount || 1)) * 100));
            return (
              <div key={camp._id} className="glass-card overflow-hidden flex flex-col justify-between group">
                <div className="relative h-48 w-full bg-slate-900">
                  <img
                    src={camp.bannerImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {camp.isUrgent && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 fill-slate-950" /> Urgent Relief
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {camp.ngo?.organizationName || 'Verified NGO'}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{camp.tagline || camp.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Raised: ₹{camp.raisedAmount?.toLocaleString('en-IN')}</span>
                      <span className="text-emerald-400">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-500">Target: ₹{camp.targetAmount?.toLocaleString('en-IN')}</div>
                  </div>

                  <Link href={`/donate?campaignId=${camp._id}`} className="btn-primary w-full py-2.5 text-xs">
                    <Heart className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Support Campaign</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL (NGO ONLY) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Launch Social Campaign
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="e.g. Free Medical Health Camp in East Delhi"
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={newCampaign.category}
                    onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                    className="glass-input w-full bg-slate-900"
                  >
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="food_hunger">Food Security</option>
                    <option value="environment">Environment</option>
                    <option value="disaster_relief">Disaster Relief</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCampaign.targetAmount}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: Number(e.target.value) })}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              {/* AI Generator Button */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Description Generator
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={aiLoading}
                    className="btn-secondary py-1 px-3 text-[10px]"
                  >
                    {aiLoading ? 'Generating...' : 'Auto-Generate'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Click auto-generate to create engaging campaign content with AI.</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Tagline</label>
                <input
                  type="text"
                  required
                  value={newCampaign.tagline}
                  onChange={(e) => setNewCampaign({ ...newCampaign, tagline: e.target.value })}
                  placeholder="Catchy summary for social sharing..."
                  className="glass-input w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Description</label>
                <textarea
                  rows={4}
                  required
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Detailed campaign background..."
                  className="glass-input w-full"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-xs font-bold">
                Publish Campaign
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
