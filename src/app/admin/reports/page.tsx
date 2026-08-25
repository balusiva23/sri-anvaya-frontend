'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { BarChart3, TrendingUp, IndianRupee, ShieldCheck, Award } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/admin/reports').then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Enterprise Analytics & Operations Intelligence"
        subtitle="Comprehensive financial projections, ceremony completion rates, and provider welfare metrics."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Financial Overview */}
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-maroon-700">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-cinzel text-base font-bold text-maroon-900">Financial Growth</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Projected Annual ARR:</span>
                <span className="font-extrabold text-charcoal-900">₹36,000</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">YTD Digital Collections:</span>
                <span className="font-extrabold text-emerald-800">₹4,500</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Recurring Retention:</span>
                <span className="font-extrabold text-charcoal-900">100%</span>
              </div>
            </div>
          </div>

          {/* Operations Overview */}
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-maroon-700">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-cinzel text-base font-bold text-maroon-900">Service Operations</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">On-Time Arrival:</span>
                <span className="font-extrabold text-emerald-800">99.4%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Team Allocation:</span>
                <span className="font-extrabold text-charcoal-900">4 Providers / Event</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Checklist Accuracy:</span>
                <span className="font-extrabold text-charcoal-900">100% Verified</span>
              </div>
            </div>
          </div>

          {/* Provider Welfare Overview */}
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-gold-700">
              <Award className="w-5 h-5" />
              <h3 className="font-cinzel text-base font-bold text-maroon-900">Welfare & Social Impact</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Welfare Allocation:</span>
                <span className="font-extrabold text-gold-800">12% Fixed</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Total Accumulated:</span>
                <span className="font-extrabold text-maroon-900">₹120,000</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-canvas border border-sand flex justify-between">
                <span className="text-charcoal-800/70">Providers Enrolled:</span>
                <span className="font-extrabold text-charcoal-900">4 Vedic Partners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
