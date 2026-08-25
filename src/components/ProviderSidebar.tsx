'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  IndianRupee,
  Wallet,
  UserCheck,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { name: 'Provider Hub', href: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'My Assignments', href: '/provider/events', icon: CalendarCheck },
  { name: 'Availability Calendar', href: '/provider/availability', icon: CalendarRange },
  { name: 'Direct Earnings', href: '/provider/earnings', icon: IndianRupee },
  { name: '12% Welfare Wallet', href: '/provider/wallet', icon: Wallet },
];

export default function ProviderSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-warmwhite border-r border-sand flex flex-col h-screen sticky top-0">
      <div className="h-20 px-6 flex items-center space-x-3 border-b border-sand">
        <div className="w-9 h-9 rounded-lg bg-gold-600 text-maroon-900 flex items-center justify-center font-cinzel font-bold text-lg shadow-sm">
          ॐ
        </div>
        <div>
          <span className="font-cinzel font-bold text-lg tracking-wider text-maroon-900 block leading-tight">
            SRI ANVAYA
          </span>
          <span className="text-[9px] tracking-widest uppercase text-gold-700 font-semibold block">
            Vedic Provider Portal
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-maroon-700 text-white shadow-sm'
                  : 'text-charcoal-800 hover:bg-cream hover:text-maroon-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'text-charcoal-800/60'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-gold-300" />}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sand">
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 mb-3">
          <div className="flex items-center space-x-1.5 text-gold-800 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4 text-gold-700" />
            <span>Welfare Protection</span>
          </div>
          <p className="text-[11px] text-gold-900/80 mt-1">
            12% of every event is credited to your dedicated health & security fund.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-800 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.fullName?.charAt(0) || 'P'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-charcoal-900 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-charcoal-800/60 truncate">Vedic Provider</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-charcoal-800/60 hover:text-maroon-700 rounded-lg hover:bg-maroon-50"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
