'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCheck,
  CreditCard,
  Receipt,
  HeartHandshake,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Executive Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Customer Directory', href: '/admin/customers', icon: Users },
  { name: 'Sradham 360 Events', href: '/admin/events', icon: CalendarDays },
  { name: 'Provider Management', href: '/admin/providers', icon: UserCheck },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Payments & Gateway', href: '/admin/payments', icon: Receipt },
  { name: '12% Welfare Reconcile', href: '/admin/welfare-wallet', icon: HeartHandshake },
  { name: 'Communications Hub', href: '/admin/communications', icon: MessageSquare },
  { name: 'Analytics & Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'System & Infra Status', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isMobileOpen, closeSidebar } = useSidebar();

  const sidebarContent = (
    <div className="w-72 lg:w-64 bg-charcoal-950 text-sand border-r border-charcoal-800 flex flex-col h-full select-none">
      {/* Brand Header with Close X Button on Mobile */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-charcoal-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-maroon-800 text-gold-400 flex items-center justify-center font-cinzel font-bold text-lg shadow-sm border border-gold-500/30 shrink-0">
            ॐ
          </div>
          <div>
            <span className="font-cinzel font-bold text-lg tracking-wider text-warmwhite block leading-tight">
              SRI ANVAYA
            </span>
            <span className="text-[9px] tracking-widest uppercase text-gold-400 font-semibold block">
              Enterprise Admin
            </span>
          </div>
        </div>

        {/* Mobile Close X Button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden p-1.5 rounded-xl text-sand/60 hover:text-warmwhite hover:bg-charcoal-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-maroon-700 text-warmwhite font-semibold shadow-sm'
                  : 'text-sand/70 hover:bg-charcoal-900 hover:text-sand'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'text-sand/50'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-gold-300" />}
            </Link>
          );
        })}
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-charcoal-800 bg-charcoal-900/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-maroon-800 text-gold-300 font-bold text-xs flex items-center justify-center shrink-0 border border-gold-500/30">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-warmwhite truncate">{user?.fullName}</p>
              <p className="text-[10px] text-gold-400 font-mono truncate">{user?.roles?.[0] || 'ADMIN'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className="p-1.5 text-sand/60 hover:text-rose-400 rounded-lg hover:bg-charcoal-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
