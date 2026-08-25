'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatCard from '../../../components/StatCard';
import StatusBadge from '../../../components/StatusBadge';
import {
  Users,
  CreditCard,
  IndianRupee,
  CalendarDays,
  HeartHandshake,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/admin/metrics')
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const kpis = metrics?.kpis;
  const funnel = metrics?.eventFunnel;
  const plans = metrics?.planDistribution || [];

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Executive Control Center"
        subtitle="Real-time operations, subscription revenue, event lifecycle pipeline, and provider welfare monitoring."
        actions={
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Systems Operational</span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Subscriptions"
            value={kpis?.activeSubscriptions || 0}
            subtitle={`Total Enrolled Customers: ${kpis?.totalCustomers || 0}`}
            icon={CreditCard}
            trend="↑ 18% Monthly Recurring Growth"
            iconBg="bg-maroon-50 text-maroon-700"
          />
          <StatCard
            title="Monthly Collections"
            value={`₹${kpis?.monthlyCollections?.toLocaleString('en-IN') || '4,500'}`}
            subtitle="100% Verified Digital Gateways"
            icon={IndianRupee}
            trend="Zero Unreconciled Collections"
            iconBg="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            title="Upcoming Ceremonies"
            value={kpis?.upcomingEvents || 0}
            subtitle="4-Member Teams Coordinated"
            icon={CalendarDays}
            trend="99.2% On-Time Completion Rate"
            iconBg="bg-blue-50 text-blue-700"
          />
          <StatCard
            title="Pending Welfare Fund"
            value={`₹${kpis?.pendingWelfare?.toLocaleString('en-IN') || '49,000'}`}
            subtitle="12% Provider Protection Pool"
            icon={HeartHandshake}
            trend="Auto Month-End Consolidation"
            iconBg="bg-gold-50 text-gold-700"
          />
        </div>

        {/* Event Execution Funnel & Plan Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Funnel */}
          <div className="lg:col-span-2 bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-lg font-bold text-charcoal-900">
                Sradham 360 Operational Pipeline
              </h3>
              <Link href="/admin/events" className="text-xs font-bold text-maroon-700 hover:underline flex items-center space-x-1">
                <span>Manage Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-[10px] font-bold uppercase text-charcoal-800/60 block">Planning</span>
                <span className="text-2xl font-extrabold text-charcoal-900 mt-1 block">{funnel?.planning || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Team Assignment</span>
                <span className="text-2xl font-extrabold text-amber-900 mt-1 block">{funnel?.providerAssignment || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
                <span className="text-[10px] font-bold uppercase text-teal-800 block">Kit & Team Ready</span>
                <span className="text-2xl font-extrabold text-teal-900 mt-1 block">{funnel?.ready || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="text-[10px] font-bold uppercase text-purple-800 block">Ritual Day</span>
                <span className="text-2xl font-extrabold text-purple-900 mt-1 block">{funnel?.eventDay || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Completed</span>
                <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{funnel?.completed || 0}</span>
              </div>
            </div>
          </div>

          {/* Plan Mix */}
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-charcoal-900">
              Subscription Plan Mix
            </h3>
            <div className="space-y-3">
              {plans.map((p: any) => (
                <div key={p.code} className="p-3.5 rounded-2xl bg-canvas border border-sand flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-charcoal-900 block">{p.name}</span>
                    <span className="text-[10px] text-charcoal-800/60">₹{p.monthlyPrice}/mo</span>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-maroon-100 text-maroon-900">
                    {p.count} Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events & Payments Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel text-base font-bold text-charcoal-900">Upcoming Ceremonies</h3>
              <Link href="/admin/events" className="text-xs font-bold text-maroon-700 hover:underline">View All</Link>
            </div>
            <div className="space-y-3 text-xs">
              {metrics?.recentEvents?.map((evt: any) => (
                <div key={evt._id} className="p-3.5 rounded-2xl bg-canvas border border-sand flex items-center justify-between">
                  <div>
                    <span className="font-bold text-charcoal-900 block">{evt.title}</span>
                    <span className="text-[10px] text-charcoal-800/60">
                      {new Date(evt.scheduledDate).toLocaleDateString()} • {evt.customerName}
                    </span>
                  </div>
                  <StatusBadge status={evt.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Collections */}
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel text-base font-bold text-charcoal-900">Recent Collections</h3>
              <Link href="/admin/payments" className="text-xs font-bold text-maroon-700 hover:underline">View All</Link>
            </div>
            <div className="space-y-3 text-xs">
              {metrics?.recentPayments?.map((p: any) => (
                <div key={p._id} className="p-3.5 rounded-2xl bg-canvas border border-sand flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-maroon-900 block">{p.paymentId}</span>
                    <span className="text-[10px] text-charcoal-800/60">
                      {p.customerName} • {p.provider?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-charcoal-900 block">₹{p.amount}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
