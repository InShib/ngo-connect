import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950">
                <Heart className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="text-2xl font-black text-white">
                NGO <span className="gradient-text">CONNECT</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering non-profits, volunteers, and donors with enterprise digital infrastructure, real-time inventory tracking, AI automation, and 100% donation transparency.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ngos" className="hover:text-emerald-400 transition-colors">Verified NGOs</Link></li>
              <li><Link href="/campaigns" className="hover:text-emerald-400 transition-colors">Active Campaigns</Link></li>
              <li><Link href="/donate" className="hover:text-emerald-400 transition-colors">Donate Items & Funds</Link></li>
              <li><Link href="/volunteers" className="hover:text-emerald-400 transition-colors">Volunteer Opportunities</Link></li>
              <li><Link href="/events" className="hover:text-emerald-400 transition-colors">Social Drives & Camps</Link></li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Enterprise</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/beneficiaries" className="hover:text-emerald-400 transition-colors">Beneficiary Portal</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">NGO Dashboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Admin Control Room</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Impact Stories & Blog</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About NGO CONNECT</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">Subscribe for monthly impact reports and emergency campaign alerts.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="w-full btn-primary py-2 text-xs">
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 NGO CONNECT. Built for social impact and digital transformation.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">80G Tax Exemption Guide</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
