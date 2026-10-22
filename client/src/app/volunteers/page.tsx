'use client';

import React, { useState, useEffect } from 'react';
import { Award, Users, QrCode, Clock, CheckCircle2, Trophy, Star, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { api, getStoredUser } from '@/lib/api';

export default function VolunteersPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // QR Checkin Modal
  const [checkinEventId, setCheckinEventId] = useState<string | null>(null);
  const [qrCodeInput, setQrCodeInput] = useState('QR-TREE-2026');
  const [checkinSuccess, setCheckinSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const leadRes = await api.get('/volunteers/leaderboard');
      if (leadRes.data.success) setLeaderboard(leadRes.data.data);

      const evtRes = await api.get('/events');
      if (evtRes.data.success) setEvents(evtRes.data.data);

      const user = getStoredUser();
      if (user && user.role === 'volunteer') {
        const profRes = await api.get('/volunteers/me');
        if (profRes.data.success) setUserProfile(profRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQrCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkinEventId) return;

    try {
      const user = getStoredUser();
      const res = await api.post(`/events/${checkinEventId}/checkin`, {
        qrCodeSecret: qrCodeInput,
        volunteerUserId: user?.id || 'demo_vol_id',
      });

      if (res.data.success) {
        setCheckinSuccess('Attendance verified via QR! 4 Volunteer Hours awarded.');
        setTimeout(() => {
          setCheckinEventId(null);
          setCheckinSuccess('');
          fetchData();
        }, 2000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Check-in failed. Please verify QR secret.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mx-auto">
          <Award className="w-4 h-4" />
          <span>QR-Verified Community Volunteering</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Volunteer <span className="gradient-text">Hub & Leaderboard</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Join tree plantation drives, medical camps, and education programs. Earn verified hours, unlock tier badges, and top the leaderboard.
        </p>
      </div>

      {/* Volunteer Badges & Stats (If logged in volunteer) */}
      {userProfile && (
        <div className="glass-panel p-6 border-emerald-500/30 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-semibold">Tier Badge</div>
            <div className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" /> {userProfile.badgeLevel || 'Bronze'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-semibold">Verified Hours</div>
            <div className="text-xl font-black text-white">{userProfile.totalHoursWorked || 0} Hours</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-semibold">Events Attended</div>
            <div className="text-xl font-black text-teal-400">{userProfile.completedEventsCount || 0} Drives</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 uppercase font-semibold">Certificates Issued</div>
            <div className="text-xl font-black text-cyan-400">{userProfile.certificates?.length || 1} Issued</div>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-black text-white">Top Community Volunteers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboard.map((vol, idx) => (
            <div key={vol._id || idx} className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-lg">
                #{idx + 1}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white line-clamp-1">{vol.user?.name || 'Priya Patel'}</h4>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{vol.totalHoursWorked} Hours</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{vol.badgeLevel} Badge</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Volunteer Drives & Events */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-black text-white">Upcoming Volunteer Drives</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div key={evt._id} className="glass-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-bold uppercase">
                    {evt.category?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {evt.startTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{evt.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>

                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{evt.location?.venue}, {evt.location?.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setCheckinEventId(evt._id)}
                  className="btn-primary flex-1 py-2.5 text-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Attendance Check-in</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR CHECKIN MODAL */}
      {checkinEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel p-6 space-y-4 text-center">
            <QrCode className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Event QR Attendance Check-In</h3>
            <p className="text-xs text-slate-400">Scan event organizer QR code or enter event verification secret.</p>

            {checkinSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                {checkinSuccess}
              </div>
            ) : (
              <form onSubmit={handleQrCheckinSubmit} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  placeholder="Enter QR Code Secret..."
                  className="glass-input text-center w-full"
                />
                <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold">
                  Verify Attendance & Earn 4 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setCheckinEventId(null)}
                  className="btn-secondary w-full py-2 text-xs"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
