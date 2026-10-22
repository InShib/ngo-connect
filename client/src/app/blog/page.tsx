'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, User, Calendar, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mx-auto">
          <BookOpen className="w-4 h-4" />
          <span>Non-Profit Stories & Insights</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Impact Stories & <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Read real stories of community transformations, technology in non-profits, and 80G tax exemption guides.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div key={b._id} className="glass-card overflow-hidden flex flex-col justify-between group">
              <div className="relative h-48 w-full bg-slate-900">
                <img
                  src={b.coverImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 text-emerald-400 border border-slate-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  {b.category}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3">{b.excerpt}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
                  <span>{b.authorName || 'NGO CONNECT Team'}</span>
                  <span>{b.readTime || '4 min read'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
