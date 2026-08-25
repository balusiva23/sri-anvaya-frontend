'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import Modal from '../../../components/Modal';
import {
  CalendarDays,
  Users2,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [teamForm, setTeamForm] = useState({
    purohithId: '',
    swamigal1Id: '',
    swamigal2Id: '',
    cookId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [evts, provs] = await Promise.all([
        apiFetch('/events/all'),
        apiFetch('/providers/all'),
      ]);
      setEvents(evts);
      setProviders(provs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (evt: any) => {
    setSelectedEvent(evt);
    setTeamForm({
      purohithId: evt.assignedTeam?.purohithId || '',
      swamigal1Id: evt.assignedTeam?.swamigal1Id || '',
      swamigal2Id: evt.assignedTeam?.swamigal2Id || '',
      cookId: evt.assignedTeam?.cookId || '',
    });
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/assignments/assign-team', {
        method: 'POST',
        body: JSON.stringify({
          eventId: selectedEvent._id,
          team: teamForm,
        }),
      });
      setSelectedEvent(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const purohiths = providers.filter((p) => p.role === 'PUROHITH');
  const swamigals = providers.filter((p) => p.role === 'SWAMIGAL');
  const cooks = providers.filter((p) => p.role === 'COOK');

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Sradham 360 Event Operations & Assignment Engine"
        subtitle="Schedule ceremonies, assign the 4-member Vedic ritual team, monitor checklists, and track on-time arrival."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-sand">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">
                      {event.pitruRecord?.relationship} Ceremony
                    </span>
                    <StatusBadge status={event.status} />
                  </div>
                  <h3 className="font-cinzel text-2xl font-bold text-maroon-900 mt-1">{event.title}</h3>
                  <p className="text-xs text-charcoal-800/70 mt-1">
                    Customer: <strong>{event.customer?.fullName}</strong> ({event.customer?.phone}) • Venue: {event.location?.address || event.location?.city}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleOpenAssignModal(event)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Assign 4-Member Team</span>
                  </button>
                </div>
              </div>

              {/* 4-Member Team Assigned Cards */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60 block mb-3">
                  Assigned Vedic Ritual Team
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-canvas border border-sand">
                    <span className="text-[10px] font-bold uppercase text-maroon-700 block">1. Chief Vadhyar</span>
                    <p className="font-bold text-xs text-charcoal-900 mt-1">
                      {event.assignedTeamDetails?.purohith?.fullName || 'Unassigned'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-canvas border border-sand">
                    <span className="text-[10px] font-bold uppercase text-maroon-700 block">2. Vishwadeva Swamigal</span>
                    <p className="font-bold text-xs text-charcoal-900 mt-1">
                      {event.assignedTeamDetails?.swamigal1?.fullName || 'Unassigned'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-canvas border border-sand">
                    <span className="text-[10px] font-bold uppercase text-maroon-700 block">3. Pitru Swamigal</span>
                    <p className="font-bold text-xs text-charcoal-900 mt-1">
                      {event.assignedTeamDetails?.swamigal2?.fullName || 'Unassigned'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-canvas border border-sand">
                    <span className="text-[10px] font-bold uppercase text-maroon-700 block">4. Orthodox Madi Cook</span>
                    <p className="font-bold text-xs text-charcoal-900 mt-1">
                      {event.assignedTeamDetails?.cook?.fullName || 'Unassigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Team Assignment Engine Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={`Assign 4-Member Team for ${selectedEvent?.title || ''}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveTeam} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">
              1. Chief Vadhyar (Senior Purohith)
            </label>
            <select
              value={teamForm.purohithId}
              onChange={(e) => setTeamForm({ ...teamForm, purohithId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold"
            >
              <option value="">Select verified Purohith</option>
              {purohiths.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.fullName} ({p.city} - Rating: {p.rating}★)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">
                2. Vishwadeva Swamigal
              </label>
              <select
                value={teamForm.swamigal1Id}
                onChange={(e) => setTeamForm({ ...teamForm, swamigal1Id: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold"
              >
                <option value="">Select Swamigal 1</option>
                {swamigals.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">
                3. Pitru Swamigal
              </label>
              <select
                value={teamForm.swamigal2Id}
                onChange={(e) => setTeamForm({ ...teamForm, swamigal2Id: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold"
              >
                <option value="">Select Swamigal 2</option>
                {swamigals.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} ({p.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">
              4. Traditional Madi Cook
            </label>
            <select
              value={teamForm.cookId}
              onChange={(e) => setTeamForm({ ...teamForm, cookId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold"
            >
              <option value="">Select orthodox Madi cook</option>
              {cooks.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.fullName} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-gold-50 border border-gold-200 text-xs text-gold-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-gold-700 shrink-0" />
            <span>Assigning will notify all 4 providers and lock tithi slot.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md"
          >
            Confirm & Dispatch Team Assignments
          </button>
        </form>
      </Modal>
    </div>
  );
}
