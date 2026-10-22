'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Gift,
  Search,
  Building2,
  Globe2,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalDonations: '₹24.8 Lakhs+',
    livesImpacted: '58,400+',
    activeNgos: '120+',
    volunteersCount: '1,450+',
  });

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    // Fetch live campaigns & NGOs from backend
    const fetchData = async () => {
      try {
        const campRes = await api.get('/campaigns?isFeatured=true');
        if (campRes.data.success) setCampaigns(campRes.data.data);

        const ngoRes = await api.get('/ngos?status=verified');
        if (ngoRes.data.success) setNgos(ngoRes.data.data);
      } catch (err) {
        // Graceful fallback for initial load
      }
    };
    fetchData();
  }, []);

  const faqs = [
    {
      q: 'How does NGO CONNECT ensure 100% donation transparency?',
      a: 'Every monetary donation generates an instant 80G compliant PDF tax receipt with a unique QR code. For physical items, doorstep pickup tracking provides real-time status updates from dispatch to warehouse delivery.',
    },
    {
      q: 'How do NGOs get verified on the platform?',
      a: 'NGOs must submit their official 12A/80G registration certificate, government ID proof, and audit statements. Our admin review panel inspects every document before granting the blue verified badge.',
    },
    {
      q: 'Can volunteers receive official certificates for their hours?',
      a: 'Yes! Volunteers check into events using unique QR codes scanned by event organizers. Accumulated hours automatically trigger digital certificates and tier badges (Bronze, Silver, Gold, Hero).',
    },
    {
      q: 'What is the Inter-NGO Surplus Inventory Exchange?',
      a: 'NGO CONNECT allows non-profits to list surplus supplies (e.g. extra food packages or books) so other verified local NGOs can request and transfer resources directly.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glowing Background Radial Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Next-Gen Enterprise NGO SaaS Platform</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Connecting NGOs, Donors & Volunteers <br />
            <span className="gradient-text">Through Technology</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            One unified digital ecosystem powering transparent donations, doorstep physical item pickups, QR-verified volunteering, and AI-driven social impact.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/donate" className="btn-primary text-base py-4 px-8 w-full sm:w-auto">
              <span>Donate Now or Schedule Pickup</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/ngos" className="btn-secondary text-base py-4 px-8 w-full sm:w-auto">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Explore Verified NGOs</span>
            </Link>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto pt-6">
            <div className="glass-panel p-2 flex items-center gap-2 shadow-2xl border-slate-800">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search campaigns, food drives, blood camps, or NGOs near you..."
                className="w-full bg-transparent border-none text-slate-100 text-sm placeholder-slate-500 focus:outline-none px-2 py-2"
              />
              <Link href="/campaigns" className="btn-primary py-2.5 px-5 text-xs shrink-0">
                Search
              </Link>
            </div>
          </div>

          {/* Platform Trust Pills */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% 80G Tax Exempt Receipts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Government Verified NGOs
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI Volunteer Matching
            </span>
          </div>
        </div>
      </section>

      {/* IMPACT METRICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{stats.totalDonations}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Funds Raised</div>
          </div>

          <div className="glass-card p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{stats.livesImpacted}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Lives Impacted</div>
          </div>

          <div className="glass-card p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{stats.activeNgos}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Verified NGOs</div>
          </div>

          <div className="glass-card p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{stats.volunteersCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Volunteers</div>
          </div>
        </div>
      </section>

      {/* FEATURED CAMPAIGNS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Urgent Action Required</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Featured High-Impact Campaigns</h2>
          </div>
          <Link href="/campaigns" className="btn-secondary text-xs py-2.5 px-4 w-fit">
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.slice(0, 3).map((camp, idx) => {
            const percent = Math.min(100, Math.round((camp.raisedAmount / (camp.targetAmount || 1)) * 100));
            return (
              <div key={camp._id || idx} className="glass-card overflow-hidden flex flex-col group">
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={camp.bannerImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {camp.category?.replace('_', ' ')}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{camp.tagline || camp.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Raised: ₹{camp.raisedAmount?.toLocaleString('en-IN')}</span>
                      <span className="text-emerald-400">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Target: ₹{camp.targetAmount?.toLocaleString('en-IN')}</div>
                  </div>

                  <Link href={`/campaigns/${camp._id}`} className="btn-primary w-full py-2.5 text-xs">
                    <span>Donate to Campaign</span>
                    <Heart className="w-3.5 h-3.5 fill-slate-950" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DUAL DONATION ENGINE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <Gift className="w-4 h-4" />
                <span>Doorstep Item Pickup & Money Donations</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Donate Money or Physical Items with <span className="gradient-text">Full Logistics Tracking</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you wish to contribute funds with instant 80G tax exemption certificates, or donate surplus food, clothes, medicine, books, or electronics from your home, NGO CONNECT manages the entire workflow seamlessly.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold text-sm">Instant PDF Receipts</div>
                  <div className="text-slate-400 text-xs">Automated tax savings receipts issued immediately upon donation.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-teal-400 font-bold text-sm">Doorstep Pickups</div>
                  <div className="text-slate-400 text-xs">Schedule hassle-free item pickup with real-time status barcodes.</div>
                </div>
              </div>

              <Link href="/donate" className="btn-primary py-3.5 px-6 text-sm w-fit">
                Start Donation Process
              </Link>
            </div>

            <div className="relative">
              <div className="glass-card p-6 space-y-6 border-slate-700/80 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      QR
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Live Tracking Code</div>
                      <div className="text-xs text-slate-400">Barcode: ITEM-REC-8849-DELHI</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                    In Transit
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-200">Doorstep Pickup Completed</div>
                      <div className="text-slate-500">Scheduled driver collected 15 Warm Jackets</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400 bg-emerald-400/20 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <div className="font-semibold text-slate-200">En Route to NGO Central Warehouse</div>
                      <div className="text-slate-500">Beneficiary NGO: Food For All Trust</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Everything You Need to Know</div>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-bold text-sm text-slate-200 flex items-center justify-between gap-4 hover:text-emerald-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
