'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, Bot, User, LogOut, Menu, X, ShieldCheck, Sparkles, PlusCircle } from 'lucide-react';
import { getStoredUser, clearStoredSession } from '@/lib/api';

interface NavbarProps {
  onOpenAiChat?: () => void;
}

export default function Navbar({ onOpenAiChat }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  const handleLogout = () => {
    clearStoredSession();
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'NGOs', href: '/ngos' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Donate', href: '/donate' },
    { name: 'Volunteers', href: '/volunteers' },
    { name: 'Events', href: '/events' },
    { name: 'Beneficiaries', href: '/beneficiaries' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <Heart className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                NGO <span className="gradient-text">CONNECT</span>
              </span>
              <span className="block text-[10px] tracking-wider font-semibold text-slate-400 uppercase -mt-1">
                SaaS Impact Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions & User Control */}
          <div className="hidden lg:flex items-center gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiChat}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>AI Assistant</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-xs py-2.5 px-4">
                  Log In
                </Link>
                <Link href="/register" className="btn-primary text-xs py-2.5 px-4">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenAiChat}
              className="p-2 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-xl border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Go to {user.role.toUpperCase()} Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary w-full text-center">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary text-center">
                  Log In
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
