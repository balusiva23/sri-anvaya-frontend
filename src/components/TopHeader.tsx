'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserCircle,
  ExternalLink,
} from 'lucide-react';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopHeader({ title, subtitle, actions }: TopHeaderProps) {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.push('/login');
  };

  const getProfileLink = () => {
    if (user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN')) {
      return '/admin/settings';
    }
    if (user?.roles?.includes('PROVIDER')) {
      return '/provider/dashboard';
    }
    return '/customer/profile';
  };

  return (
    <header className="h-20 bg-warmwhite border-b border-sand px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        {/* Mobile Hamburger Toggle Button (Hidden on Desktop) */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-1 rounded-xl text-charcoal-800 hover:text-maroon-900 hover:bg-cream/60 focus:outline-none focus:ring-2 focus:ring-maroon-700/20 transition-all shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-charcoal-900 font-serif tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-charcoal-800/60 mt-0.5 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        {actions && <div className="shrink-0">{actions}</div>}

        {/* Profile Dropdown */}
        <div className="relative pl-2 sm:pl-4 border-l border-sand shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-2xl hover:bg-cream/40 transition-all focus:outline-none"
            aria-expanded={dropdownOpen}
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-charcoal-900 leading-none">{user?.fullName || 'User Profile'}</p>
              <p className="text-[10px] text-charcoal-800/60 mt-1 font-mono">{user?.email || ''}</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-maroon-700 text-gold-300 font-cinzel font-bold text-xs flex items-center justify-center border-2 border-gold-500/40 shadow-sm">
              {user?.fullName?.charAt(0) || <User className="w-4 h-4" />}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-charcoal-800/60 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-maroon-700' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-warmwhite border border-sand shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Header in Dropdown */}
              <div className="p-3 bg-canvas rounded-xl border border-sand/60 mb-2">
                <p className="font-bold text-xs text-charcoal-900 truncate">{user?.fullName || 'Sri Anvaya Member'}</p>
                <p className="text-[11px] text-charcoal-800/60 font-mono truncate">{user?.email || ''}</p>
                <div className="mt-2 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-maroon-100 text-maroon-900 text-[10px] font-bold">
                    {user?.roles?.[0] || 'CUSTOMER'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-1 text-xs font-semibold text-charcoal-900">
                <Link
                  href={getProfileLink()}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cream/50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gold-600" />
                  <span>Profile & Account</span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cream/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gold-600" />
                  <span>Public Website Home</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-sand" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Sri Anvaya</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
