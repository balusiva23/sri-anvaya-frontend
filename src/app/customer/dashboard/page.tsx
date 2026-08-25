'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/customers/profile')
      .then((data) => setProfileData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const nextEvent = profileData?.upcomingEvents?.[0];
  const subscription = profileData?.subscription;
  const family = profileData?.family;
  const pitruRecords = profileData?.pitruRecords || [];

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title={`Namaskaram, ${user?.fullName || 'Valued Customer'}`}
        subtitle="Manage your family lineage records, recurring subscriptions, and annual Sradham operations."
        actions={
          <Link
            href="/customer/onboarding"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cream hover:bg-sand text-maroon-900 text-xs font-bold border border-sand transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Onboarding Wizard</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Next Sradham Hero Card */}
        {nextEvent ? (
          <div className="maroon-gradient-bg rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gold-300 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming Sradham Ceremony</span>
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-warmwhite">
                  {nextEvent.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-sand/80 pt-1 font-serif">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>
                      {new Date(nextEvent.scheduledDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <span>{nextEvent.location?.city || 'Chennai'}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/15">
                  <span className="text-[10px] uppercase tracking-wider text-sand/60 block">Event Status</span>
                  <span className="font-bold text-sm text-gold-300 block mt-0.5">
                    {nextEvent.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <Link
                  href="/customer/events"
                  className="px-6 py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-maroon-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                >
                  <span>View Full Event Lifecycle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Checklist Preview Bar */}
            <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-sand/60 text-[10px] block uppercase">Vedic Team</span>
                <span className="font-semibold text-warmwhite mt-0.5 block">4-Member Assigned</span>
              </div>
              <div>
                <span className="text-sand/60 text-[10px] block uppercase">Samagri Kit</span>
                <span className="font-semibold text-warmwhite mt-0.5 block">Dispatched & Verified</span>
              </div>
              <div>
                <span className="text-sand/60 text-[10px] block uppercase">Dakshina</span>
                <span className="font-semibold text-warmwhite mt-0.5 block">100% Pre-funded</span>
              </div>
              <div>
                <span className="text-sand/60 text-[10px] block uppercase">Welfare Contribution</span>
                <span className="font-semibold text-gold-300 mt-0.5 block">12% Allocated</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-warmwhite rounded-3xl p-8 border border-sand text-center space-y-4">
            <Calendar className="w-12 h-12 text-maroon-700 mx-auto" />
            <h3 className="font-cinzel text-xl font-bold text-charcoal-900">No Upcoming Sradham Scheduled</h3>
            <p className="text-xs text-charcoal-800/70 max-w-md mx-auto">
              Please complete your Pitru records in the onboarding wizard to automatically compute your annual ceremony date.
            </p>
            <Link
              href="/customer/onboarding"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-maroon-700 text-white font-bold text-xs shadow-md"
            >
              <span>Complete Setup Now</span>
            </Link>
          </div>
        )}

        {/* 3-Column Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subscription Card */}
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800/60">Subscription</span>
                <StatusBadge status={subscription?.status || 'PENDING'} />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-2">
                {subscription?.plan?.name || 'Standard Sradham 360'}
              </h3>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-charcoal-900">
                  ₹{subscription?.plan?.monthlyPrice || 1500}
                </span>
                <span className="text-xs text-charcoal-800/60 ml-2 font-medium">/ month</span>
              </div>
              <p className="text-xs text-charcoal-800/70 mt-2">
                Next renewal: {subscription?.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : '01 Sep 2026'}
              </p>
            </div>

            <Link
              href="/customer/subscription"
              className="mt-6 w-full text-center py-2.5 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-900 font-bold text-xs transition-colors block"
            >
              Manage Subscription & Invoices
            </Link>
          </div>

          {/* Family & Pitru Registry */}
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800/60">Ancestral Lineage</span>
                <span className="text-xs font-bold text-maroon-700">{pitruRecords.length} Records</span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-2">
                {family?.gothram || 'Koundinya Gothram'}
              </h3>
              <p className="text-xs text-charcoal-800/70 mt-1">
                Kuladeivam: {family?.kuladeivam || 'Sri Prasanna Venkatesa Perumal'}
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-charcoal-800">
                {pitruRecords.map((p: any) => (
                  <div key={p._id} className="p-2 rounded-xl bg-cream/60 flex items-center justify-between">
                    <span className="font-semibold">{p.pitruName}</span>
                    <span className="text-[11px] text-charcoal-800/60">{p.relationship}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/customer/pitru-records"
              className="mt-6 w-full text-center py-2.5 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-900 font-bold text-xs transition-colors block"
            >
              View All Pitru Records
            </Link>
          </div>

          {/* Quick Actions & Support */}
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800/60">Concierge Desk</span>
              <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-2">
                Relationship Manager
              </h3>
              <p className="text-xs text-charcoal-800/70 mt-1">
                Dedicated support for special sampradayam requests, theertham, and guest prasadams.
              </p>
              <div className="mt-4 p-3 rounded-2xl bg-gold-50 border border-gold-200">
                <div className="flex items-center space-x-2 text-gold-900 font-bold text-xs">
                  <PhoneCall className="w-4 h-4 text-gold-700" />
                  <span>Direct Hotline: +91 98840 12345</span>
                </div>
                <p className="text-[10px] text-gold-800/70 mt-1">Available 8 AM - 8 PM IST for ritual queries.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Link
                href="/customer/family"
                className="text-center py-2 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-900 font-bold text-[11px] transition-colors"
              >
                + Family
              </Link>
              <Link
                href="/customer/pitru-records"
                className="text-center py-2 rounded-xl bg-sand/60 hover:bg-sand text-charcoal-900 font-bold text-[11px] transition-colors"
              >
                + Add Pitru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
