'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import { Wallet, ShieldCheck, Heart, ArrowUpRight, CheckCircle2, History } from 'lucide-react';

export default function ProviderWalletPage() {
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await apiFetch('/wallet/me');
      setWalletData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const wallet = walletData?.wallet;
  const transactions = walletData?.transactions || [];

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="12% Vedic Provider Welfare Wallet"
        subtitle="Automatic social security fund dedicated to healthcare, life protection, and children’s education."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Wallet Main Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-maroon-800 to-maroon-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-300">Current Balance</span>
              <Wallet className="w-6 h-6 text-gold-400" />
            </div>
            <h3 className="text-4xl font-extrabold font-cinzel text-warmwhite mt-3">
              ₹{wallet?.currentBalance?.toLocaleString('en-IN') || '14,400'}
            </h3>
            <p className="text-xs text-sand/80 mt-2 font-serif">
              Ready for Month-End Insurance & Protection Disbursement
            </p>
          </div>

          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800/60">Lifetime Accumulated</span>
            <h3 className="text-3xl font-bold text-charcoal-900 mt-2">
              ₹{wallet?.lifetimeAllocated?.toLocaleString('en-IN') || '34,800'}
            </h3>
            <p className="text-xs text-charcoal-800/70 mt-1">12% from every completed ceremony</p>
          </div>

          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800/60">Total Disbursed (Protection)</span>
            <h3 className="text-3xl font-bold text-emerald-800 mt-2">
              ₹{wallet?.lifetimeDisbursed?.toLocaleString('en-IN') || '20,400'}
            </h3>
            <p className="text-xs text-emerald-700 font-semibold mt-1">Settled to Health & Welfare Policy</p>
          </div>
        </div>

        {/* Welfare Trust Banner */}
        <div className="bg-gold-50/70 rounded-3xl p-6 border border-gold-300/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <ShieldCheck className="w-7 h-7 text-maroon-700 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-maroon-900 font-serif">The Sri Anvaya Welfare Covenant</h4>
              <p className="text-xs text-gold-950/80 mt-0.5 max-w-2xl">
                Unlike informal markets where priests receive unpredictable dakshina without safety nets, Sri Anvaya guarantees institutional dignity and monthly health fund allocations.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-maroon-800 px-4 py-2 rounded-xl bg-gold-200/60 shrink-0">
            Fixed 12% Auto-Allocation
          </div>
        </div>

        {/* Wallet Transactions Ledger */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
          <h3 className="font-cinzel text-lg font-bold text-charcoal-900 mb-6 flex items-center space-x-2">
            <History className="w-5 h-5 text-gold-600" />
            <span>Wallet Transaction Ledger</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                {transactions.length > 0 ? (
                  transactions.map((tx: any) => (
                    <tr key={tx._id} className="hover:bg-cream/30">
                      <td className="py-3.5 px-4 text-charcoal-800/70">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 font-bold text-maroon-900">{tx.type}</td>
                      <td className="py-3.5 px-4">{tx.description}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">+₹{tx.amount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-charcoal-800/60">
                      Completed assignments will automatically record 12% welfare credits here.
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
