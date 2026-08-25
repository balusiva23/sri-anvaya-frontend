'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import Modal from '../../../components/Modal';
import { Users, Plus, Trash2, Edit3, ShieldCheck, Heart } from 'lucide-react';

export default function CustomerFamilyPage() {
  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ fullName: '', relationship: '', phone: '', notes: '' });

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const data = await apiFetch('/families');
      setFamily(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/families/members', {
        method: 'POST',
        body: JSON.stringify(newMember),
      });
      setIsModalOpen(false);
      setNewMember({ fullName: '', relationship: '', phone: '', notes: '' });
      fetchFamily();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this family member?')) {
      try {
        await apiFetch(`/families/members/${id}`, { method: 'DELETE' });
        fetchFamily();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Family Registry & Gothram"
        subtitle="Manage family members who participate in sacred Sankalpam and ceremonies."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Heritage Header Banner */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Lineage Gothram</span>
            <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-1">{family?.gothram || 'Koundinya Gothram'}</h3>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Kuladeivam</span>
            <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-1">{family?.kuladeivam || 'Sri Prasanna Venkatesa Perumal'}</h3>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60">Native Place</span>
            <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-1">{family?.nativePlace || 'Thanjavur, Tamil Nadu'}</h3>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-lg font-bold text-charcoal-900">Registered Family Members ({family?.members?.length || 0})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {family?.members?.map((member: any) => (
              <div key={member.id} className="bg-warmwhite rounded-2xl p-5 border border-sand shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-700">{member.relationship}</span>
                    {member.relationship !== 'Self / Kartha' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 text-charcoal-800/40 hover:text-rose-600 rounded"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-charcoal-900 mt-2">{member.fullName}</h4>
                  {member.phone && <p className="text-xs text-charcoal-800/70 mt-1 font-mono">{member.phone}</p>}
                  {member.notes && <p className="text-xs text-charcoal-800/60 mt-2 italic">{member.notes}</p>}
                </div>
                <div className="mt-4 pt-3 border-t border-sand/60 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sankalpam Eligible</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Family Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newMember.fullName}
              onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
              placeholder="e.g. Radha Sundaram"
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Relationship</label>
            <select
              value={newMember.relationship}
              onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
            >
              <option value="">Select relationship</option>
              <option value="Wife (Dharmapatni)">Wife (Dharmapatni)</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Mother">Mother</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              placeholder="+91 94440 98766"
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Notes / Location (e.g. NRI USA)</label>
            <input
              type="text"
              value={newMember.notes}
              onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
              placeholder="e.g. Living in California - joins via stream"
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md"
          >
            Save Family Member
          </button>
        </form>
      </Modal>
    </div>
  );
}
