'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users2,
  PackageCheck,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function CustomerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await apiFetch('/events/my');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklist = async (eventId: string, itemIndex: number, currentStatus: boolean) => {
    try {
      await apiFetch(`/events/${eventId}/checklist`, {
        method: 'PUT',
        body: JSON.stringify({ itemIndex, isCompleted: !currentStatus }),
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Annual Sradham Ceremony Lifecycle"
        subtitle="Track ceremony preparation, 4-member Vedic team assignment, live checklist, and completion confirmation."
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {events.map((event) => (
          <div key={event._id} className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-sand">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">
                  {event.pitruRecord?.relationship} Ceremony
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-maroon-900">{event.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-800/70 pt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    <span className="font-bold">
                      {new Date(event.scheduledDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gold-600" />
                    <span>{event.location?.address || event.location?.city}</span>
                  </span>
                </div>
              </div>
              <div>
                <StatusBadge status={event.status} className="text-sm px-3.5 py-1" />
              </div>
            </div>

            {/* Lifecycle Visual Stepper */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60 block mb-3">
                Event Execution Pipeline
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                {[
                  { code: 'PLANNING', label: '1. Planning' },
                  { code: 'CONFIRMATION_REQUIRED', label: '2. Tithi Confirmed' },
                  { code: 'PROVIDER_ASSIGNMENT', label: '3. Team Assigned' },
                  { code: 'READY', label: '4. Kit Ready' },
                  { code: 'EVENT_DAY', label: '5. Ritual Day' },
                  { code: 'COMPLETED', label: '6. Completed' },
                ].map((st, i) => {
                  const isCurrent = event.status === st.code;
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold ${
                        isCurrent
                          ? 'bg-maroon-700 text-white border-maroon-700 shadow-sm'
                          : 'bg-canvas text-charcoal-800/60 border-sand'
                      }`}
                    >
                      {st.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4-Member Assigned Team Card */}
            <div>
              <h3 className="font-cinzel text-base font-bold text-maroon-900 mb-4 flex items-center space-x-2">
                <Users2 className="w-5 h-5 text-gold-600" />
                <span>Assigned 4-Member Ritual Team</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-canvas border border-sand">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 block">Chief Vadhyar (Purohith)</span>
                  <p className="font-bold text-sm text-charcoal-900 mt-1">
                    {event.assignedTeamDetails?.purohith?.fullName || 'Sri Krishna Vadhyar'}
                  </p>
                  <p className="text-[11px] text-charcoal-800/70 mt-0.5">Rating: 4.98 ★ (Verified)</p>
                </div>
                <div className="p-4 rounded-2xl bg-canvas border border-sand">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 block">Vishwadeva Swamigal</span>
                  <p className="font-bold text-sm text-charcoal-900 mt-1">
                    {event.assignedTeamDetails?.swamigal1?.fullName || 'Sri Ramaswamy Shastrigal'}
                  </p>
                  <p className="text-[11px] text-charcoal-800/70 mt-0.5">Vedic Scholar (Verified)</p>
                </div>
                <div className="p-4 rounded-2xl bg-canvas border border-sand">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 block">Pitru Swamigal</span>
                  <p className="font-bold text-sm text-charcoal-900 mt-1">
                    {event.assignedTeamDetails?.swamigal2?.fullName || 'Sri Subramanian Dikshitar'}
                  </p>
                  <p className="text-[11px] text-charcoal-800/70 mt-0.5">Vedic Scholar (Verified)</p>
                </div>
                <div className="p-4 rounded-2xl bg-canvas border border-sand">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-700 block">Traditional Madi Cook</span>
                  <p className="font-bold text-sm text-charcoal-900 mt-1">
                    {event.assignedTeamDetails?.cook?.fullName || 'Sri Anantha Rama Iyer'}
                  </p>
                  <p className="text-[11px] text-charcoal-800/70 mt-0.5">Orthodox Madi Cook</p>
                </div>
              </div>
            </div>

            {/* Checklist Section */}
            <div>
              <h3 className="font-cinzel text-base font-bold text-maroon-900 mb-4 flex items-center space-x-2">
                <PackageCheck className="w-5 h-5 text-gold-600" />
                <span>Operational Checklist & Fulfillment</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.checklist?.map((chk: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(event._id, idx, chk.isCompleted)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      chk.isCompleted
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-canvas border-sand text-charcoal-800/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${chk.isCompleted ? 'text-emerald-600' : 'text-charcoal-800/30'}`}
                      />
                      <span className="text-xs font-semibold">{chk.item}</span>
                    </div>
                    {chk.completedAt && (
                      <span className="text-[10px] text-emerald-700 font-mono">
                        {new Date(chk.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
