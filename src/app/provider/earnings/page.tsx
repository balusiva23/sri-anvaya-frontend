'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { IndianRupee, ShieldCheck, Download, History } from 'lucide-react';

export default function ProviderEarningsPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/providers/profile').then((data) => {
      setProfileData(data);
      setLoading(false);
    });
  }, []);

  const earnings = profileData?.earnings || [];

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Direct Remuneration & Payout Ledger"
        subtitle="Transparent accounting of net payouts (88%) and dedicated welfare allocations (12%)."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
          <h3 className="font-cinzel text-lg font-bold text-charcoal-900 mb-6 flex items-center space-x-2">
            <IndianRupee className="w-5 h-5 text-gold-600" />
            <span>Remuneration Ledger</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                <tr>
                  <th className="py-3 px-4">Payout Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Gross Remuneration</th>
                  <th className="py-3 px-4">12% Welfare Deduction</th>
                  <th className="py-3 px-4">Net Direct Payout</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                {earnings.length > 0 ? (
                  earnings.map((e: any) => (
                    <tr key={e._id} className="hover:bg-cream/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-maroon-900">{e.payoutReference}</td>
                      <td className="py-3.5 px-4 text-charcoal-800/70">{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 font-bold">₹{e.grossAmount}</td>
                      <td className="py-3.5 px-4 text-gold-800 font-semibold">-₹{e.welfareAmount} (12%)</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-800 text-sm">₹{e.netDirectPayout}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          {e.payoutStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-charcoal-800/60">
                      No payouts recorded yet. Completed services will appear here with instant calculation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
