'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import { CreditCard, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function CustomerSubscriptionPage() {
  const [subData, setSubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const data = await apiFetch('/subscriptions/my');
      setSubData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (confirm('Are you sure you want to pause/cancel your Sradham 360 subscription?')) {
      try {
        await apiFetch('/subscriptions/cancel', { method: 'POST' });
        fetchSubscription();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="My Sradham 360 Subscription"
        subtitle="Manage recurring monthly membership, billing cycle, and plan inclusions."
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {subData ? (
          <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sand">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800/60">Active Plan</span>
                <h2 className="font-cinzel text-3xl font-bold text-maroon-900 mt-1">{subData.plan?.name}</h2>
                <p className="text-xs text-charcoal-800/70 mt-1">{subData.plan?.description}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={subData.status} />
                <p className="text-3xl font-extrabold text-charcoal-900 mt-2">
                  ₹{subData.plan?.monthlyPrice}
                  <span className="text-xs text-charcoal-800/60 font-normal"> / mo</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Subscription Start Date</span>
                <span className="font-bold text-charcoal-900 mt-1 block">
                  {new Date(subData.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Next Billing Date</span>
                <span className="font-bold text-charcoal-900 mt-1 block">
                  {subData.nextBillingDate ? new Date(subData.nextBillingDate).toLocaleDateString() : '01 Sep 2026'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Auto-Renewal State</span>
                <span className="font-bold text-emerald-700 mt-1 block">Enabled (Seamless)</span>
              </div>
            </div>

            <div>
              <h3 className="font-cinzel text-lg font-bold text-charcoal-900 mb-4">Included in Your Plan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subData.plan?.inclusions?.map((inc: string, i: number) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs text-charcoal-800 p-3 rounded-xl bg-cream/40">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-sand flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-charcoal-800/70">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by Sri Anvaya 100% Ceremonial Assurance</span>
              </div>
              <button
                onClick={handleCancel}
                className="text-xs font-bold text-rose-700 hover:text-rose-900"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-warmwhite rounded-3xl p-8 border border-sand text-center space-y-4">
            <CreditCard className="w-12 h-12 text-maroon-700 mx-auto" />
            <h3 className="font-cinzel text-xl font-bold text-charcoal-900">No Active Subscription</h3>
            <p className="text-xs text-charcoal-800/70">Choose an annual Sradham 360 subscription plan to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
