'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import { UserCheck, Star, Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/providers/all').then((data) => {
      setProviders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Vedic Service Provider Directory"
        subtitle="Manage Purohiths, Swamigals, and orthodox Madi cooks, verification ratings, and availability."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-lg font-bold text-charcoal-900">Enrolled Providers ({providers.length})</h3>
            <span className="text-xs font-semibold text-charcoal-800/60">100% Identity & Shastra Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                <tr>
                  <th className="py-3 px-4">Provider Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">City / Service Locations</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Completed Events</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-cream/30">
                    <td className="py-4 px-4 font-bold font-serif text-maroon-900">
                      {p.fullName}
                      <span className="block text-[10px] text-charcoal-800/60 font-mono">{p.phone}</span>
                    </td>
                    <td className="py-4 px-4 uppercase font-bold text-[11px] text-charcoal-800">{p.role}</td>
                    <td className="py-4 px-4">{p.city} ({p.serviceLocations?.join(', ') || 'All Zones'})</td>
                    <td className="py-4 px-4 font-bold text-amber-800">
                      <span className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{p.rating || 4.9}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-charcoal-900">{p.completedEventsCount || 0}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isAvailable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {p.isAvailable ? 'AVAILABLE' : 'BUSY'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{p.verificationStatus || 'VERIFIED'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
