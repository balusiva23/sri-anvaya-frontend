'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import {
  CalendarCheck,
  IndianRupee,
  Wallet,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pData, asgs] = await Promise.all([
        apiFetch('/providers/profile'),
        apiFetch('/assignments/my'),
      ]);
      setProfileData(pData);
      setAssignments(asgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiFetch(`/assignments/${id}/respond`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArrive = async (id: string) => {
    try {
      await apiFetch(`/assignments/${id}/arrive`, { method: 'POST' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await apiFetch(`/assignments/${id}/complete`, { method: 'POST' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const activeAssignment = assignments[0];
  const wallet = profileData?.wallet;

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title={`Namaskaram, ${profileData?.provider?.fullName || user?.fullName}`}
        subtitle={`Role: ${profileData?.provider?.role || 'Purohith'} | Verified Vedic Partner`}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Earnings & 12% Welfare Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Lifetime Direct Earnings</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-charcoal-900">
                ₹{profileData?.earnings?.reduce((acc: number, e: any) => acc + (e.netDirectPayout || 0), 0) || '24,640'}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-2">100% On-Time Bank Settled</p>
          </div>

          <div className="bg-gold-50/80 rounded-3xl p-6 border border-gold-300 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-900">12% Welfare Wallet Balance</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-maroon-900">
                ₹{wallet?.currentBalance || '14,400'}
              </span>
            </div>
            <p className="text-xs text-gold-800 font-semibold mt-2">Accruing towards Month-End Protection</p>
          </div>

          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Completed Ceremonies</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-charcoal-900">
                {profileData?.provider?.completedEventsCount || 142}
              </span>
            </div>
            <p className="text-xs text-charcoal-800/70 mt-2">Vedic Rating: 4.98 ★</p>
          </div>
        </div>

        {/* Current Active Assignment Card */}
        {activeAssignment ? (
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sand">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">
                    Role: {activeAssignment.roleInEvent}
                  </span>
                  <StatusBadge status={activeAssignment.status} />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-maroon-900 mt-1">
                  {activeAssignment.event?.title || 'Annual Sradham Service'}
                </h3>
                <p className="text-xs text-charcoal-800/70 font-serif mt-1">
                  Customer: {activeAssignment.event?.customer?.fullName} ({activeAssignment.event?.customer?.phone})
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60 block">Remuneration</span>
                <span className="text-2xl font-extrabold text-charcoal-900 block mt-0.5">
                  ₹{activeAssignment.grossRemuneration || 3500}
                </span>
                <span className="text-[11px] text-gold-700 font-semibold block">(Incl. 12% Welfare Accrual)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-canvas border border-sand">
                <Clock className="w-4 h-4 text-maroon-700 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900 block">Date & Timing</span>
                  <span className="text-charcoal-800/70 mt-0.5 block">
                    {new Date(activeAssignment.event?.scheduledDate || Date.now()).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' '}• 7:30 AM IST
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-canvas border border-sand">
                <MapPin className="w-4 h-4 text-maroon-700 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900 block">Venue Location</span>
                  <span className="text-charcoal-800/70 mt-0.5 block">
                    {activeAssignment.event?.location?.address || 'Flat 4B, Heritage Towers, Mylapore, Chennai'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile-Friendly Action Buttons */}
            <div className="pt-4 border-t border-sand flex flex-wrap gap-3">
              {activeAssignment.status === 'ASSIGNED' && (
                <>
                  <button
                    onClick={() => handleRespond(activeAssignment._id, 'ACCEPTED')}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Accept Assignment
                  </button>
                  <button
                    onClick={() => handleRespond(activeAssignment._id, 'REJECTED')}
                    className="px-6 py-3.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-all"
                  >
                    Decline
                  </button>
                </>
              )}

              {activeAssignment.status === 'ACCEPTED' && (
                <button
                  onClick={() => handleArrive(activeAssignment._id)}
                  className="flex-1 py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Mark On-Site Arrival (Ritual Day)</span>
                </button>
              )}

              {activeAssignment.status === 'ARRIVED' && (
                <button
                  onClick={() => handleComplete(activeAssignment._id)}
                  className="flex-1 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Service & Settle Remuneration</span>
                </button>
              )}

              {activeAssignment.status === 'COMPLETED' && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-2 w-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Service Completed & 12% Welfare Credited to Wallet!</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-warmwhite rounded-3xl p-8 border border-sand text-center space-y-4">
            <CalendarCheck className="w-12 h-12 text-maroon-700 mx-auto" />
            <h3 className="font-cinzel text-xl font-bold text-charcoal-900">No Pending Assignments</h3>
            <p className="text-xs text-charcoal-800/70">You will be notified when a new ceremony matches your location and sampradayam.</p>
          </div>
        )}
      </div>
    </div>
  );
}
