'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { MessageSquare, Send, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function AdminCommunicationsPage() {
  const [communications, setCommunications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/notifications/all').then((data) => {
      setCommunications(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Automated Communications Hub"
        subtitle="Track multi-channel WhatsApp, SMS, Email reminders, and real-time operational broadcasts."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-lg font-bold text-charcoal-900">Dispatched Communications ({communications.length})</h3>
            <span className="text-xs font-semibold text-charcoal-800/60">WhatsApp / SMS / In-App Multi-Channel</span>
          </div>

          <div className="space-y-3">
            {communications.map((comm) => (
              <div key={comm._id} className="p-4 rounded-2xl bg-canvas border border-sand flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-maroon-100 text-maroon-900 font-bold text-[10px]">
                      {comm.channel}
                    </span>
                    <span className="font-bold text-charcoal-900">{comm.title}</span>
                  </div>
                  <p className="text-charcoal-800/80 font-serif">{comm.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    {comm.status}
                  </span>
                  <span className="block text-[10px] text-charcoal-800/60 mt-1 font-mono">
                    {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
