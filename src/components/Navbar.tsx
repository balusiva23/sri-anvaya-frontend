'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    router.push('/login');
  };

  const getPortalLink = () => {
    if (!user) return '/login';
    if (user.roles?.includes('ADMIN') || user.roles?.includes('SUPER_ADMIN') || user.roles?.includes('OPERATIONS')) {
      return '/admin/dashboard';
    }
    if (user.roles?.includes('PROVIDER')) {
      return '/provider/dashboard';
    }
    return '/customer/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-maroon-700 text-gold-400 flex items-center justify-center font-cinzel font-bold text-xl shadow-md border border-gold-500/30 group-hover:scale-105 transition-transform">
              ॐ
            </div>
            <div>
              <span className="font-cinzel font-bold text-2xl tracking-wider text-maroon-900 block leading-tight">
                SRI ANVAYA
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold-600 font-medium block">
                Sradham 360 Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-charcoal-800">
            <Link href="/" className="hover:text-maroon-700 transition-colors">
              Home
            </Link>
            <Link href="/sradham-360" className="hover:text-maroon-700 transition-colors">
              Sradham 360
            </Link>
            <Link href="/how-it-works" className="hover:text-maroon-700 transition-colors">
              How It Works
            </Link>
            <Link href="/plans" className="hover:text-maroon-700 transition-colors">
              Plans & Pricing
            </Link>
            <Link href="/about" className="hover:text-maroon-700 transition-colors">
              About Us
            </Link>
            <Link href="/faq" className="hover:text-maroon-700 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-maroon-700 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-warmwhite border border-sand hover:border-gold-500/50 shadow-sm transition-all text-xs font-bold text-charcoal-900"
                >
                  <div className="w-7 h-7 rounded-full bg-maroon-700 text-gold-300 flex items-center justify-center font-cinzel font-bold text-xs">
                    {user.fullName?.charAt(0) || <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span>{user.fullName || 'My Account'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-charcoal-800/60 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-warmwhite border border-sand shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2.5 bg-canvas rounded-xl border border-sand/60 mb-2">
                      <p className="font-bold text-xs text-charcoal-900 truncate">{user.fullName}</p>
                      <p className="text-[10px] text-charcoal-800/60 font-mono truncate">{user.email}</p>
                    </div>

                    <Link
                      href={getPortalLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-cream/50 text-xs font-bold text-charcoal-900 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gold-600" />
                      <span>Go to Dashboard</span>
                    </Link>

                    <div className="my-1 border-t border-sand" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-maroon-800 hover:text-maroon-900 px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-medium text-sm shadow-sm transition-all group"
                >
                  <span>Plan Your Sradham</span>
                  <ArrowRight className="w-4 h-4 text-gold-300 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-900 hover:text-maroon-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warmwhite border-b border-sand px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            Home
          </Link>
          <Link
            href="/sradham-360"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            Sradham 360
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            How It Works
          </Link>
          <Link
            href="/plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            Plans
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            About
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal-900 font-medium"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-sand flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  href={getPortalLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-maroon-700 text-white font-medium text-sm"
                >
                  My Portal
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 rounded-full border border-rose-200 bg-rose-50 text-rose-800 font-medium text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-maroon-700 text-white font-medium text-sm"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
