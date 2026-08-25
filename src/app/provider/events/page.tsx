'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import StatusBadge from '../../../components/StatusBadge';
import { CalendarCheck, MapPin, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export default function ProviderEventsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await apiFetch('/assignments/my');
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiFetch(`/assignments/${id}/respond`, { method: 'POST', body: JSON.stringify({ status }) });
      loadAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArrive = async (id: string) => {
    try {
      await apiFetch(`/assignments/${id}/arrive`, { method: 'POST' });
      loadAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await apiFetch(`/assignments/${id}/complete`, { method: 'POST' });
      loadAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="My Ritual Assignments & Schedule"
        subtitle="Accept invitations, navigate to ceremony locations, and mark milestones."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {assignments.map((asg) => (
          <div key={asg._id} className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-sand">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">Role: {asg.roleInEvent}</span>
                <h3 className="font-cinzel text-xl font-bold text-maroon-900 mt-1">{asg.event?.title}</h3>
                <p className="text-xs text-charcoal-800/70 mt-0.5">
                  Customer: {asg.event?.customer?.fullName} ({asg.event?.customer?.phone})
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status={asg.status} />
                <span className="text-lg font-bold text-charcoal-900">₹{asg.grossRemuneration}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <span>Scheduled: {new Date(asg.event?.scheduledDate || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <span>Venue: {asg.event?.location?.address || asg.event?.location?.city}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-sand flex flex-wrap gap-3">
              {asg.status === 'ASSIGNED' && (
                <>
                  <button
                    onClick={() => handleRespond(asg._id, 'ACCEPTED')}
                    className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-sm"
                  >
                    Accept Assignment
                  </button>
                  <button
                    onClick={() => handleRespond(asg._id, 'REJECTED')}
                    className="px-6 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 font-bold text-xs"
                  >
                    Decline
                  </button>
                </>
              )}
              {asg.status === 'ACCEPTED' && (
                <button
                  onClick={() => handleArrive(asg._id)}
                  className="flex-1 py-3 rounded-xl bg-maroon-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Mark Arrived on Location</span>
                </button>
              )}
              {asg.status === 'ARRIVED' && (
                <button
                  onClick={() => handleComplete(asg._id)}
                  className="flex-1 py-3 rounded-xl bg-gold-500 text-maroon-950 font-bold text-xs shadow-sm flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Service</span>
                </button>
              )}
              {asg.status === 'COMPLETED' && (
                <span className="text-xs text-emerald-800 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Successfully Fulfilled</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
