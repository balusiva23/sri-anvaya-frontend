'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import Modal from '../../../components/Modal';
import { ScrollText, Plus, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function PitruRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newPitru, setNewPitru] = useState({
    pitruName: '',
    relationship: 'Father',
    calendarType: 'Chandramana',
    masa: '',
    paksha: 'Krishna Paksha (Mahalaya)',
    tithi: '',
    nakshatra: '',
    englishDate: '',
    annualDateNotes: '',
    notes: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await apiFetch('/pitru-records');
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/pitru-records', {
        method: 'POST',
        body: JSON.stringify(newPitru),
      });
      setIsModalOpen(false);
      setNewPitru({
        pitruName: '',
        relationship: 'Father',
        calendarType: 'Chandramana',
        masa: '',
        paksha: 'Krishna Paksha (Mahalaya)',
        tithi: '',
        nakshatra: '',
        englishDate: '',
        annualDateNotes: '',
        notes: '',
      });
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this Pitru record?')) {
      try {
        await apiFetch(`/pitru-records/${id}`, { method: 'DELETE' });
        fetchRecords();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Pitru Records & Sacred Tithi Registry"
        subtitle="Maintain accurate ancestral departure records, tithi calculations, and annual ceremony requirements."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pitru Record</span>
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">
                    {record.relationship}
                  </span>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="p-1 text-charcoal-800/40 hover:text-rose-600 rounded"
                    title="Remove record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-cinzel text-2xl font-bold text-charcoal-900 mt-2">
                  {record.pitruName}
                </h3>
                <p className="text-xs text-charcoal-800/60 mt-0.5">Kartha: {record.karthaName}</p>

                <div className="mt-6 p-4 rounded-2xl bg-canvas border border-sand grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Calendar Type</span>
                    <span className="font-semibold text-charcoal-900">{record.calendarType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Masa / Month</span>
                    <span className="font-semibold text-charcoal-900">{record.masa || 'Bhadrapada'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Paksha</span>
                    <span className="font-semibold text-charcoal-900">{record.paksha || 'Krishna Paksha'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Tithi & Nakshatra</span>
                    <span className="font-semibold text-charcoal-900">{record.tithi || 'Navami'} {record.nakshatra ? `(${record.nakshatra})` : ''}</span>
                  </div>
                </div>

                {record.notes && (
                  <p className="mt-4 text-xs text-charcoal-800/80 italic bg-cream/50 p-3 rounded-xl">
                    &quot;{record.notes}&quot;
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-sand flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Annual Sradham 360 Linked</span>
                </div>
                <span className="font-mono text-charcoal-800/60">
                  {record.englishDate ? new Date(record.englishDate).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Ancestral Pitru Record" maxWidth="max-w-2xl">
        <form onSubmit={handleCreateRecord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Pitru Name</label>
              <input
                type="text"
                required
                value={newPitru.pitruName}
                onChange={(e) => setNewPitru({ ...newPitru, pitruName: e.target.value })}
                placeholder="e.g. Late Sri V. Subramania Sharma"
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Relationship</label>
              <select
                value={newPitru.relationship}
                onChange={(e) => setNewPitru({ ...newPitru, relationship: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
              >
                <option value="Father">Father (Pithru)</option>
                <option value="Mother">Mother (Mathru)</option>
                <option value="Grandfather">Grandfather (Pithaamaha)</option>
                <option value="Grandmother">Grandmother (Pithaamahi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Calendar</label>
              <select
                value={newPitru.calendarType}
                onChange={(e) => setNewPitru({ ...newPitru, calendarType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
              >
                <option value="Chandramana">Lunar (Chandramana)</option>
                <option value="Solar">Solar (Tamil/Malayalam)</option>
                <option value="Gregorian">Gregorian Fixed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Masa / Month</label>
              <input
                type="text"
                value={newPitru.masa}
                onChange={(e) => setNewPitru({ ...newPitru, masa: e.target.value })}
                placeholder="Bhadrapada"
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Tithi</label>
              <input
                type="text"
                value={newPitru.tithi}
                onChange={(e) => setNewPitru({ ...newPitru, tithi: e.target.value })}
                placeholder="Navami"
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Upcoming English Date (2026)</label>
            <input
              type="date"
              value={newPitru.englishDate}
              onChange={(e) => setNewPitru({ ...newPitru, englishDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Special Ritual Instructions</label>
            <textarea
              rows={3}
              value={newPitru.notes}
              onChange={(e) => setNewPitru({ ...newPitru, notes: e.target.value })}
              placeholder="e.g. Requires 2 Vedic Swamigals and dedicated traditional Madi Cook."
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md"
          >
            Save Record & Auto-Schedule Annual Event
          </button>
        </form>
      </Modal>
    </div>
  );
}
