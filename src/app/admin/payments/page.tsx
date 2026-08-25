'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import Modal from '../../../components/Modal';
import { Receipt, ShieldCheck, Printer, FileText } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await apiFetch('/payments/all');
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Gateway Transactions & Collections Ledger"
        subtitle="Live payment captures from Razorpay & Stripe with automated webhook reconciliation."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-lg font-bold text-charcoal-900">Collections Ledger ({payments.length})</h3>
            <span className="text-xs font-semibold text-charcoal-800/60">Idempotent Multi-Gateway Monitor</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-cream/30">
                    <td className="py-4 px-4 font-mono font-bold text-maroon-900">{p.paymentId}</td>
                    <td className="py-4 px-4 text-charcoal-800/70">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 font-bold">{p.customer?.fullName || 'Customer'}</td>
                    <td className="py-4 px-4 font-mono uppercase text-[11px]">{p.provider}</td>
                    <td className="py-4 px-4 font-extrabold text-sm">₹{p.amount}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-maroon-50 hover:bg-maroon-100 text-maroon-900 text-xs font-bold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-maroon-700" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Official Sri Anvaya Receipt / Tax Invoice Modal */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title="Official Sri Anvaya Tax Invoice & Receipt"
        maxWidth="max-w-2xl"
      >
        {selectedReceipt && (
          <div className="space-y-6 text-xs text-charcoal-900">
            <div id="printable-receipt" className="p-6 sm:p-8 rounded-2xl bg-white border border-sand shadow-inner space-y-6 font-sans">
              <div className="flex justify-between items-start border-b border-sand pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-maroon-700 text-gold-400 flex items-center justify-center font-cinzel font-bold text-base">
                      ॐ
                    </div>
                    <span className="font-cinzel text-xl font-extrabold text-maroon-900">SRI ANVAYA</span>
                  </div>
                  <p className="text-[10px] text-charcoal-800/70 mt-1">Honouring Roots. Enriching Generations.</p>
                  <p className="text-[10px] text-charcoal-800/60 font-mono mt-0.5">Heritage Towers, Mylapore, Chennai — 600004</p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    PAID IN FULL
                  </span>
                  <p className="text-xs font-mono font-bold text-maroon-900 mt-1">{selectedReceipt.paymentId}</p>
                  <p className="text-[10px] text-charcoal-800/60">
                    Date: {new Date(selectedReceipt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-canvas border border-sand text-[11px]">
                <div>
                  <span className="text-[9px] font-bold uppercase text-charcoal-800/60 block">Billed To</span>
                  <p className="font-bold text-charcoal-900 mt-0.5">{selectedReceipt.customer?.fullName || 'Sundaram Sharma'}</p>
                  <p className="text-charcoal-800/70">Mylapore, Chennai</p>
                </div>

                <div>
                  <span className="text-[9px] font-bold uppercase text-charcoal-800/60 block">Gateway & Reference</span>
                  <p className="font-bold text-charcoal-900 mt-0.5 uppercase">{selectedReceipt.provider} Gateway</p>
                  <p className="text-charcoal-800/70 font-mono text-[10px]">Txn ID: {selectedReceipt.providerPaymentId || 'pay_rzp_mock_8819021'}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-sand text-charcoal-800/60 font-bold text-[10px] uppercase">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Cycle</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/60 text-[11px]">
                  <tr>
                    <td className="py-2.5 font-medium">
                      Sradham 360 Annual Ritual Membership Contribution
                    </td>
                    <td className="py-2.5 text-center text-charcoal-800/70">Monthly</td>
                    <td className="py-2.5 text-right font-bold">₹{selectedReceipt.amount}.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-sand font-bold text-xs">
                    <td colSpan={2} className="py-3 text-right">Total Amount Paid:</td>
                    <td className="py-3 text-right text-base text-maroon-900">₹{selectedReceipt.amount}.00</td>
                  </tr>
                </tfoot>
              </table>

              <div className="pt-3 border-t border-sand flex items-center justify-between text-[10px] text-charcoal-800/60">
                <span>Computer generated official tax invoice & receipt.</span>
                <span className="font-mono text-emerald-800 font-bold">✓ Verified by Sri Anvaya Core</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl border border-sand text-charcoal-800 font-bold text-xs hover:bg-canvas"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-5 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
