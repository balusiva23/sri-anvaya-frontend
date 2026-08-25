'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { HeartHandshake, ShieldCheck, RefreshCw, CheckCircle2, History, ArrowUpRight } from 'lucide-react';

export default function AdminWelfareReconciliationPage() {
  const [reconcileData, setReconcileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [consolidating, setConsolidating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReconciliation();
  }, []);

  const fetchReconciliation = async () => {
    try {
      const data = await apiFetch('/wallet/admin/reconciliation');
      setReconcileData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsolidateMonthEnd = async () => {
    if (confirm('Execute Month-End Welfare Consolidation and disburse funds to insurance/protection policies?')) {
      setConsolidating(true);
      try {
        const res = await apiFetch('/wallet/admin/consolidate', { method: 'POST' });
        setSuccessMsg(`Successfully processed ${res.processedCount} provider welfare disbursements!`);
        fetchReconciliation();
        setTimeout(() => setSuccessMsg(''), 5000);
      } catch (err) {
        console.error(err);
      } finally {
        setConsolidating(false);
      }
    }
  };

  const summary = reconcileData?.summary;
  const providerWallets = reconcileData?.providerWallets || [];

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="12% Provider Welfare Wallet Reconciliation"
        subtitle="Consolidate accumulated provider welfare pools for health insurance and social security disbursement."
        actions={
          <button
            onClick={handleConsolidateMonthEnd}
            disabled={consolidating}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${consolidating ? 'animate-spin' : ''}`} />
            <span>{consolidating ? 'Consolidating...' : 'Run Month-End Consolidation'}</span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Current Unprocessed Balance</span>
            <h3 className="text-3xl font-extrabold font-cinzel text-maroon-900 mt-2">
              ₹{summary?.totalCurrentBalance?.toLocaleString('en-IN') || '49,000'}
            </h3>
            <p className="text-xs text-gold-700 font-semibold mt-1">Pending Month-End Batch</p>
          </div>

          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Lifetime Welfare Allocated</span>
            <h3 className="text-3xl font-bold text-charcoal-900 mt-2">
              ₹{summary?.totalAllocated?.toLocaleString('en-IN') || '120,000'}
            </h3>
            <p className="text-xs text-charcoal-800/70 mt-1">12% from completed ceremonies</p>
          </div>

          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Disbursed to Protection</span>
            <h3 className="text-3xl font-bold text-emerald-800 mt-2">
              ₹{summary?.totalDisbursed?.toLocaleString('en-IN') || '71,200'}
            </h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Settled to Policy Fund</p>
          </div>
        </div>

        {/* Provider Wallets Table */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-lg font-bold text-charcoal-900">Provider Welfare Wallets</h3>
            <span className="text-xs font-semibold text-charcoal-800/60">
              Enrolled Providers: {providerWallets.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                <tr>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Current Balance (₹)</th>
                  <th className="py-3.5 px-4">Lifetime Allocated (₹)</th>
                  <th className="py-3.5 px-4">Total Disbursed (₹)</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                {providerWallets.map((w: any) => (
                  <tr key={w._id} className="hover:bg-cream/30">
                    <td className="py-4 px-4 font-bold text-maroon-900">
                      {w.provider?.fullName}
                      <span className="block text-[10px] text-charcoal-800/60 font-mono">{w.provider?.email}</span>
                    </td>
                    <td className="py-4 px-4 uppercase font-semibold text-[11px]">{w.provider?.role}</td>
                    <td className="py-4 px-4 font-extrabold text-sm text-maroon-900">₹{w.currentBalance}</td>
                    <td className="py-4 px-4 font-bold">₹{w.lifetimeAllocated}</td>
                    <td className="py-4 px-4 font-bold text-emerald-800">₹{w.lifetimeDisbursed}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        ACTIVE
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
