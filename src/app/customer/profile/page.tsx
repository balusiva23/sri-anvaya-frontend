'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { User, Phone, Mail, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch('/customers/profile').then((data) => setProfile(data.customer));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/customers/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Customer Profile & Preferences"
        subtitle="Manage contact coordinates, service address, and sampradayam rules."
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-sm">
          {saved && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile coordinates updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b border-sand">
              <div className="w-16 h-16 rounded-full bg-maroon-700 text-gold-300 font-cinzel font-bold text-2xl flex items-center justify-center border-2 border-gold-500/30">
                {user?.fullName?.charAt(0) || 'K'}
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-maroon-900">{user?.fullName}</h3>
                <p className="text-xs text-charcoal-800/60 font-mono">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile?.fullName || ''}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Service City</label>
              <input
                type="text"
                value={profile?.serviceCity || 'Chennai'}
                onChange={(e) => setProfile({ ...profile, serviceCity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
