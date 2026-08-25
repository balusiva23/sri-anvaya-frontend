import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'SUCCESS':
      case 'COMPLETED':
      case 'VERIFIED':
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'READY':
      case 'CONFIRMED':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'PROVIDER_ASSIGNMENT':
      case 'IN_PROGRESS':
      case 'ARRIVED':
      case 'EVENT_DAY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PLANNING':
      case 'UPCOMING':
      case 'PENDING':
      case 'ASSIGNED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PAYMENT_FAILED':
      case 'FAILED':
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()} ${className}`}
    >
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
