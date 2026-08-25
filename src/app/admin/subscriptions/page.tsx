'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import Modal from '../../../components/Modal';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Package,
  Layers,
  Check,
  X,
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<'PLANS' | 'SUBSCRIPTIONS'>('PLANS');
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Plan Modal States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    code: '',
    monthlyPrice: 1500,
    annualValue: 18000,
    description: '',
    inclusions: [''],
    isRecommended: false,
    isActive: true,
  });

  // Delete Confirmation State
  const [deletingPlan, setDeletingPlan] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, subsData] = await Promise.all([
        apiFetch('/plans'),
        apiFetch('/subscriptions/all'),
      ]);
      setPlans(plansData);
      setSubscriptions(subsData);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingPlanId(null);
    setPlanForm({
      name: '',
      code: '',
      monthlyPrice: 1500,
      annualValue: 18000,
      description: '',
      inclusions: [
        'Dedicated Family Relationship Manager',
        'Annual Tithi & Calendar Computation',
        'Full 4-Member Ritual Team (1 Purohith + 2 Swamigals + 1 Cook)',
        'Traditional Samagri Kit Delivered',
      ],
      isRecommended: false,
      isActive: true,
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditModal = (plan: any) => {
    setEditingPlanId(plan._id);
    setPlanForm({
      name: plan.name,
      code: plan.code,
      monthlyPrice: plan.monthlyPrice,
      annualValue: plan.annualValue || plan.monthlyPrice * 12,
      description: plan.description || '',
      inclusions: plan.inclusions && plan.inclusions.length > 0 ? [...plan.inclusions] : [''],
      isRecommended: Boolean(plan.isRecommended),
      isActive: Boolean(plan.isActive),
    });
    setIsPlanModalOpen(true);
  };

  const handleInclusionChange = (index: number, value: string) => {
    const updated = [...planForm.inclusions];
    updated[index] = value;
    setPlanForm({ ...planForm, inclusions: updated });
  };

  const handleAddInclusion = () => {
    setPlanForm({ ...planForm, inclusions: [...planForm.inclusions, ''] });
  };

  const handleRemoveInclusion = (index: number) => {
    const updated = planForm.inclusions.filter((_, i) => i !== index);
    setPlanForm({ ...planForm, inclusions: updated.length ? updated : [''] });
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanInclusions = planForm.inclusions.filter((item) => item.trim().length > 0);
      const payload = {
        ...planForm,
        inclusions: cleanInclusions,
        monthlyPrice: Number(planForm.monthlyPrice),
        annualValue: Number(planForm.annualValue) || Number(planForm.monthlyPrice) * 12,
      };

      if (editingPlanId) {
        await apiFetch(`/plans/${editingPlanId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showNotification('success', `Plan '${planForm.name}' updated successfully!`);
      } else {
        await apiFetch('/plans', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showNotification('success', `New Plan '${planForm.name}' created successfully!`);
      }

      setIsPlanModalOpen(false);
      loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save plan');
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    try {
      await apiFetch(`/plans/${deletingPlan._id}`, {
        method: 'DELETE',
      });
      showNotification('success', `Plan '${deletingPlan.name}' deleted successfully!`);
      setDeletingPlan(null);
      loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete plan');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Subscription Plans & Recurring Membership Engine"
        subtitle="Create, edit, or customize Sradham 360 subscription tiers, pricing, inclusions, and active customer enrollments."
        actions={
          activeTab === 'PLANS' ? (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plan</span>
            </button>
          ) : undefined
        }
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all shadow-sm ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-charcoal-800/40 hover:text-charcoal-900">
              ✕
            </button>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex items-center space-x-3 border-b border-sand pb-4">
          <button
            onClick={() => setActiveTab('PLANS')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              activeTab === 'PLANS'
                ? 'bg-maroon-700 text-white shadow-md'
                : 'bg-warmwhite border border-sand text-charcoal-800 hover:bg-cream/40'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sradham 360 Plan Catalog ({plans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SUBSCRIPTIONS')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              activeTab === 'SUBSCRIPTIONS'
                ? 'bg-maroon-700 text-white shadow-md'
                : 'bg-warmwhite border border-sand text-charcoal-800 hover:bg-cream/40'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Customer Enrollments ({subscriptions.length})</span>
          </button>
        </div>

        {/* TAB 1: PLANS CATALOG (ADD / EDIT / DELETE) */}
        {activeTab === 'PLANS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`bg-warmwhite rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all ${
                    plan.isRecommended ? 'border-gold-500/80 ring-1 ring-gold-500/30' : 'border-sand'
                  }`}
                >
                  {plan.isRecommended && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold-500 text-maroon-950 font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>Recommended</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal-800/60 block">
                        Code: {plan.code}
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-1">{plan.name}</h3>
                      <p className="text-xs text-charcoal-800/70 mt-1.5 line-clamp-2">{plan.description}</p>
                    </div>

                    <div className="pt-2 pb-3 border-y border-sand">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-3xl font-extrabold text-charcoal-900 font-cinzel">
                          ₹{plan.monthlyPrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-charcoal-800/60 font-semibold">/ month</span>
                      </div>
                      <span className="text-[11px] text-charcoal-800/60 block mt-0.5">
                        Annual Value: ₹{(plan.annualValue || plan.monthlyPrice * 12)?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Inclusions list */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60 block">
                        Included Features ({plan.inclusions?.length || 0}):
                      </span>
                      <ul className="space-y-1.5 text-xs text-charcoal-800/80">
                        {plan.inclusions?.slice(0, 5).map((inc: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                        {plan.inclusions?.length > 5 && (
                          <li className="text-[11px] text-maroon-700 font-semibold pl-5.5">
                            + {plan.inclusions.length - 5} more inclusions
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Actions (Edit & Delete) */}
                  <div className="pt-6 mt-6 border-t border-sand flex items-center justify-between gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        plan.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(plan)}
                        className="px-3 py-1.5 rounded-xl border border-sand bg-canvas hover:bg-cream/40 text-charcoal-900 font-bold text-xs flex items-center space-x-1 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-maroon-700" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingPlan(plan)}
                        className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE CUSTOMER ENROLLMENTS */}
        {activeTab === 'SUBSCRIPTIONS' && (
          <div className="bg-warmwhite rounded-3xl p-6 border border-sand shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-cinzel text-lg font-bold text-charcoal-900">
                Active Customer Subscriptions ({subscriptions.length})
              </h3>
              <span className="text-xs font-semibold text-charcoal-800/60">Auto-Renewing Monthly Plans</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas text-charcoal-800/60 uppercase font-bold text-[10px] border-b border-sand">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Monthly Rate</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">Next Billing</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand font-medium text-charcoal-900">
                  {subscriptions.map((s) => (
                    <tr key={s._id} className="hover:bg-cream/30">
                      <td className="py-4 px-4 font-bold text-maroon-900">{s.customer?.fullName || 'Customer'}</td>
                      <td className="py-4 px-4 font-semibold">{s.plan?.name || 'Standard Sradham 360'}</td>
                      <td className="py-4 px-4 font-extrabold text-sm">₹{s.plan?.monthlyPrice || 1500}/mo</td>
                      <td className="py-4 px-4 text-charcoal-800/70">{new Date(s.startDate).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-charcoal-800/70">
                        {s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString() : '01 Sep 2026'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PLAN MODAL */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlanId ? `Edit Plan: ${planForm.name}` : 'Create New Sradham 360 Plan'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={planForm.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setPlanForm({
                    ...planForm,
                    name: val,
                    code: !editingPlanId ? val.toUpperCase().replace(/\s+/g, '_') : planForm.code,
                  });
                }}
                placeholder="e.g. Standard Sradham 360"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Plan Code (Identifier)</label>
              <input
                type="text"
                required
                value={planForm.code}
                onChange={(e) => setPlanForm({ ...planForm, code: e.target.value.toUpperCase() })}
                placeholder="e.g. STANDARD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Monthly Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={planForm.monthlyPrice}
                onChange={(e) => {
                  const mPrice = Number(e.target.value);
                  setPlanForm({
                    ...planForm,
                    monthlyPrice: mPrice,
                    annualValue: mPrice * 12,
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Annual Value (₹)</label>
              <input
                type="number"
                min="0"
                value={planForm.annualValue}
                onChange={(e) => setPlanForm({ ...planForm, annualValue: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Plan Description</label>
            <textarea
              rows={2}
              value={planForm.description}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              placeholder="Short summary of this package tier..."
              className="w-full px-3.5 py-2 rounded-xl border border-sand bg-canvas"
            />
          </div>

          {/* Dynamic Inclusions List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold uppercase text-charcoal-800/70">Plan Inclusions & Features</label>
              <button
                type="button"
                onClick={handleAddInclusion}
                className="text-maroon-700 font-bold text-[11px] hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {planForm.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleInclusionChange(idx, e.target.value)}
                    placeholder={`Inclusion #${idx + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-sand bg-canvas text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInclusion(idx)}
                    className="p-2 text-charcoal-800/40 hover:text-rose-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkbox Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-sand">
            <label className="flex items-center space-x-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                checked={planForm.isRecommended}
                onChange={(e) => setPlanForm({ ...planForm, isRecommended: e.target.checked })}
                className="rounded border-sand text-maroon-700 focus:ring-maroon-700"
              />
              <span>Highlight as Recommended Tier</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                checked={planForm.isActive}
                onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                className="rounded border-sand text-maroon-700 focus:ring-maroon-700"
              />
              <span>Active (Visible on public & onboarding catalog)</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-sand">
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-sand text-charcoal-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold shadow-md"
            >
              {editingPlanId ? 'Save Plan Changes' : 'Publish New Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        title="Confirm Plan Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
            <p className="font-bold">⚠️ Delete Plan Tier: {deletingPlan?.name}</p>
            <p>
              Are you sure you want to remove this plan? Existing subscribed customers will retain their current billing cycle.
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setDeletingPlan(null)}
              className="flex-1 py-2.5 rounded-xl border border-sand bg-canvas text-charcoal-800 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePlan}
              className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-md"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
