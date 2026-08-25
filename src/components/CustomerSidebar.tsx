'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ScrollText,
  Calendar,
  CreditCard,
  Receipt,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
  { name: 'Family Details', href: '/customer/family', icon: Users },
  { name: 'Pitru Records', href: '/customer/pitru-records', icon: ScrollText },
  { name: 'Annual Sradham', href: '/customer/events', icon: Calendar },
  { name: 'My Subscription', href: '/customer/subscription', icon: CreditCard },
  { name: 'Payments & Receipts', href: '/customer/payments', icon: Receipt },
  { name: 'My Profile', href: '/customer/profile', icon: User },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-warmwhite border-r border-sand flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center space-x-3 border-b border-sand">
        <div className="w-9 h-9 rounded-lg bg-maroon-700 text-gold-400 flex items-center justify-center font-cinzel font-bold text-lg shadow-sm border border-gold-500/20">
          ॐ
        </div>
        <div>
          <span className="font-cinzel font-bold text-lg tracking-wider text-maroon-900 block leading-tight">
            SRI ANVAYA
          </span>
          <span className="text-[9px] tracking-widest uppercase text-gold-600 font-semibold block">
            Customer Portal
          </span>
        </div>
      </div>

      {/* Navigation links */}
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

      {/* Customer summary box */}
      <div className="p-4 border-t border-sand">
        <div className="bg-cream rounded-xl p-3 mb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-charcoal-900">Sradham 360 Active</span>
          </div>
          <p className="text-[11px] text-charcoal-800/70 mt-1">
            Dedicated Purohith & Ritual Team assigned for upcoming tithi.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-maroon-100 text-maroon-800 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.fullName?.charAt(0) || 'C'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-charcoal-900 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-charcoal-800/60 truncate">{user?.email}</p>
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
