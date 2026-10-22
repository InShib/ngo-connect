'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User } from 'lucide-react';
import { api } from '@/lib/api';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiChatModal({ isOpen, onClose }: AiChatModalProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your NGO CONNECT AI Assistant. Ask me how to donate items, find volunteer events, or register your NGO!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setMessages((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'I am currently operating in offline mode. You can browse campaigns or donate items directly from the navigation bar!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel border border-slate-700/80 flex flex-col overflow-hidden shadow-2xl h-[550px]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                NGO CONNECT AI <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </h3>
              <span className="text-[11px] text-emerald-400 font-medium">Real-time Assistance & FAQ</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.sender === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-slate-400 bg-slate-900 p-3 rounded-2xl w-fit border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about campaigns, 80G receipts, item pickup..."
            className="flex-1 glass-input text-xs py-2.5"
          />
          <button type="submit" className="btn-primary py-2.5 px-4 text-xs">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
