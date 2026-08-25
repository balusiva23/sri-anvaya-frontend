'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  // Direct Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordNotification, setPasswordNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    apiFetch('/customers/profile').then((data) => setProfile(data.customer));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/customers/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDirectPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotification(null);

    if (newPassword !== confirmPassword) {
      setPasswordNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordNotification({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          newPassword,
        }),
      });

      setPasswordNotification({
        type: 'success',
        message: 'Password updated successfully! Your new password is now active.',
      });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordNotification(null), 4000);
    } catch (err: any) {
      setPasswordNotification({
        type: 'error',
        message: err.message || 'Failed to update password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Customer Profile & Security"
        subtitle="Manage contact coordinates, service address, and account credentials."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* 1. Profile Information Card */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
          {saved && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile coordinates updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b border-sand">
              <div className="w-16 h-16 rounded-full bg-maroon-700 text-gold-300 font-cinzel font-bold text-2xl flex items-center justify-center border-2 border-gold-500/30">
                {user?.fullName?.charAt(0) || 'K'}
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-maroon-900">{user?.fullName}</h3>
                <p className="text-xs text-charcoal-800/60 font-mono">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile?.fullName || ''}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Service City</label>
              <input
                type="text"
                value={profile?.serviceCity || 'Chennai'}
                onChange={(e) => setProfile({ ...profile, serviceCity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* 2. Direct Password Reset Section (No Current Password Required) */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm">
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-sand">
            <div className="w-10 h-10 rounded-xl bg-maroon-100 text-maroon-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-maroon-900">Direct Password Reset</h3>
              <p className="text-xs text-charcoal-800/60">
                Set a new password directly for your account. <span className="font-bold text-maroon-900">Current password is not required.</span>
              </p>
            </div>
          </div>

          {passwordNotification && (
            <div
              className={`mb-4 p-3.5 rounded-xl border flex items-center space-x-2.5 text-xs font-semibold ${
                passwordNotification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {passwordNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{passwordNotification.message}</span>
            </div>
          )}

          <form onSubmit={handleDirectPasswordReset} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-800/40 hover:text-charcoal-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand bg-canvas text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading || !newPassword}
              className="px-8 py-3 rounded-xl bg-charcoal-900 hover:bg-black text-warmwhite font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {passwordLoading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
