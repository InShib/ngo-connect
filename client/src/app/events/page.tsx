'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, ShieldCheck, Heart } from 'lucide-react';
import { api } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <Calendar className="w-4 h-4" />
          <span>Social Drives & Blood Donation Camps</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Community <span className="gradient-text">Events</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-lg">
          Participate in local food distribution drives, tree planting initiatives, and blood donation camps organized by verified NGOs.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading community drives...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div key={evt._id} className="glass-card overflow-hidden flex flex-col justify-between group">
              <div className="relative h-48 w-full bg-slate-900">
                <img
                  src={evt.bannerImage || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-slate-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  {evt.category?.replace('_', ' ')}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-400">
                    {evt.ngo?.organizationName || 'Green Earth Foundation'}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{evt.location?.venue}, {evt.location?.city}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Registered for ${evt.title}! Unique QR barcode generated.`)}
                  className="btn-primary w-full py-2.5 text-xs"
                >
                  RSVP & Get QR Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
