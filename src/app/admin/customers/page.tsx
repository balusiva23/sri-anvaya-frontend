'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import Modal from '../../../components/Modal';
import { Users, Eye, Search, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any>(null);
  const [custDetail, setCustDetail] = useState<any>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await apiFetch('/customers/all');
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (cust: any) => {
    setSelectedCust(cust);
    try {
      const detail = await apiFetch(`/customers/${cust._id}`);
      setCustDetail(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search),
  );

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Customer Directory & 360° Profile View"
        subtitle="Manage customer registrations, family lineage, Pitru records, and active subscriptions."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-canvas text-xs"
              />
            </div>
            <span className="text-xs text-charcoal-800/60 font-medium">Total Customers: {customers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Coordinates</th>
                  <th className="py-3 px-4">Service City</th>
                  <th className="py-3 px-4">Active Subscription</th>
                  <th className="py-3 px-4">Onboarding Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-cream/30">
                    <td className="py-3.5 px-4 font-bold font-serif text-maroon-900">{c.fullName}</td>
                    <td className="py-3.5 px-4">
                      <div>{c.email}</div>
                      <div className="text-[11px] text-charcoal-800/60 font-mono">{c.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">{c.serviceCity || c.address?.city || 'Chennai'}</td>
                    <td className="py-3.5 px-4">
                      {c.subscription?.plan ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          {c.subscription.plan.name}
                        </span>
                      ) : (
                        <span className="text-charcoal-800/50">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-sand text-charcoal-800 text-[10px] font-bold">
                        Step {c.onboardingStep || 1}/8
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewCustomer(c)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-maroon-50 text-maroon-700 hover:bg-maroon-100 text-xs font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360° View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer 360 Detail Modal */}
      <Modal
        isOpen={!!selectedCust}
        onClose={() => {
          setSelectedCust(null);
          setCustDetail(null);
        }}
        title={`Customer 360° Profile: ${selectedCust?.fullName || ''}`}
        maxWidth="max-w-3xl"
      >
        {custDetail ? (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-canvas border border-sand grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-800/60 block">Full Name</span>
                <span className="font-bold text-sm text-charcoal-900 mt-0.5 block">{custDetail.customer?.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-800/60 block">Phone</span>
                <span className="font-mono text-charcoal-900 mt-0.5 block">{custDetail.customer?.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-800/60 block">Email</span>
                <span className="font-mono text-charcoal-900 mt-0.5 block">{custDetail.customer?.email}</span>
              </div>
            </div>

            <div>
              <h4 className="font-cinzel text-sm font-bold text-maroon-900 mb-2">Family & Gothram Details</h4>
              <div className="p-4 rounded-2xl bg-cream/40 border border-sand space-y-2">
                <p><strong>Gothram:</strong> {custDetail.family?.gothram || 'Not specified'}</p>
                <p><strong>Kuladeivam:</strong> {custDetail.family?.kuladeivam || 'Not specified'}</p>
                <p><strong>Native Place:</strong> {custDetail.family?.nativePlace || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-cinzel text-sm font-bold text-maroon-900 mb-2">Pitru Records ({custDetail.pitruRecords?.length || 0})</h4>
              <div className="space-y-2">
                {custDetail.pitruRecords?.map((p: any) => (
                  <div key={p._id} className="p-3 rounded-xl bg-canvas border border-sand flex items-center justify-between">
                    <div>
                      <span className="font-bold text-charcoal-900">{p.pitruName}</span>
                      <span className="text-[11px] text-charcoal-800/60 ml-2">({p.relationship})</span>
                    </div>
                    <span className="text-[11px] font-mono text-maroon-800">{p.tithi} • {p.masa}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-charcoal-800/60">Loading profile details...</div>
        )}
      </Modal>
    </div>
  );
}
