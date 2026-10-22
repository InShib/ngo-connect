'use client';

import React, { useState } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AiChatModal from '@/components/AiChatModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>NGO CONNECT | Enterprise Non-Profit SaaS Platform</title>
        <meta name="description" content="Connecting NGOs, Volunteers, Donors and Communities Through Technology" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar onOpenAiChat={() => setIsAiChatOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer />
        <AiChatModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      </body>
    </html>
  );
}
