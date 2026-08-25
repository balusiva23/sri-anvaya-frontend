'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProviderAvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await apiFetch('/providers/availability', {
        method: 'PUT',
        body: JSON.stringify({ isAvailable }),
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
        title="Availability & Booking Calendar"
        subtitle="Control your operational status to receive assignments matching your geography."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-sm space-y-6">
          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Availability settings updated!</span>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-canvas border border-sand">
            <div>
              <h4 className="font-bold text-sm text-charcoal-900">Active Service Status</h4>
              <p className="text-xs text-charcoal-800/70 mt-0.5">Toggle whether you are currently accepting new Sradham assignments.</p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs shadow-sm transition-all ${
                isAvailable
                  ? 'bg-emerald-700 text-white'
                  : 'bg-rose-700 text-white'
              }`}
            >
              {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md"
          >
            Save Calendar Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
