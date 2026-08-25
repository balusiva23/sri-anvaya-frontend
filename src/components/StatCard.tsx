import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconBg = 'bg-maroon-50 text-maroon-700',
}: StatCardProps) {
  return (
    <div className="bg-warmwhite rounded-2xl p-5 border border-sand shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-800/60">{title}</p>
          <h3 className="text-2xl font-bold text-charcoal-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-charcoal-800/70 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-sand/60 flex items-center text-xs text-emerald-600 font-medium">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
