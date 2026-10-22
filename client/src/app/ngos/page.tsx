'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Search, MapPin, ShieldCheck, Heart, ExternalLink, Filter } from 'lucide-react';
import { api } from '@/lib/api';

export default function NgosPage() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNgos();
  }, [search, cityFilter]);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const params: any = { status: 'verified' };
      if (search) params.search = search;
      if (cityFilter) params.city = cityFilter;

      const res = await api.get('/ngos', { params });
      if (res.data.success) {
        setNgos(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching NGOs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Government Verified Non-Profits</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Verified NGO <span className="gradient-text">Directory</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Discover trusted non-profit organizations working across environment, education, healthcare, disaster relief, and hunger elimination.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by NGO name, mission, or cause..."
            className="glass-input pl-10 text-xs w-full py-2.5"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Filter by city..."
              className="glass-input pl-9 text-xs w-full py-2.5"
            />
          </div>
        </div>
      </div>

      {/* NGO Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading verified NGOs...</div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-20 glass-card space-y-2">
          <div className="text-slate-400 text-base font-semibold">No NGOs found matching search criteria</div>
          <div className="text-slate-500 text-xs">Try searching for "Green Earth" or "Food For All"</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <div key={ngo._id} className="glass-card overflow-hidden flex flex-col justify-between group">
              <div className="p-6 space-y-4">
                
                {/* NGO Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={ngo.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=150&q=80'}
                      alt={ngo.organizationName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {ngo.organizationName}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{ngo.city}, {ngo.state}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{ngo.mission || ngo.description}</p>

                {/* Working Areas Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ngo.workingAreas?.map((area: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium">
                      {area}
                    </span>
                  ))}
                </div>

                {/* Impact Metrics Stats */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-center">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="text-sm font-bold text-emerald-400">{(ngo.impactMetrics?.livesImpacted || 1500).toLocaleString('en-IN')}+</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Lives Saved</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="text-sm font-bold text-teal-400">₹{((ngo.impactMetrics?.totalFundsRaised || 500000) / 100000).toFixed(1)}L</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Funds Deployed</div>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex gap-2">
                <Link href={`/donate?ngoId=${ngo._id}`} className="btn-primary flex-1 py-2 text-xs">
                  <Heart className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Donate</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
