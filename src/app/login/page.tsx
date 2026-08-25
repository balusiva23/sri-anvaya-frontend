'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import Modal from '../../components/Modal';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetNotification, setResetNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('SriAnvaya@2026');
  };

  const handleOpenResetModal = () => {
    setResetEmail(email || '');
    setNewPassword('');
    setConfirmPassword('');
    setResetNotification(null);
    setIsResetModalOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetNotification(null);

    if (newPassword !== confirmPassword) {
      setResetNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setResetNotification({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setResetLoading(true);
    try {
      const res = await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: resetEmail,
          newPassword,
        }),
      });

      setResetNotification({
        type: 'success',
        message: 'Password reset successfully! Logging you in now...',
      });

      // Auto-fill password & login
      setTimeout(async () => {
        setIsResetModalOpen(false);
        try {
          await login(resetEmail, newPassword);
        } catch (err) {
          setEmail(resetEmail);
          setPassword(newPassword);
        }
      }, 1500);
    } catch (err: any) {
      setResetNotification({
        type: 'error',
        message: err.message || 'Failed to reset password. Please check your email.',
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-canvas">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-maroon-700 text-gold-400 flex items-center justify-center font-cinzel font-bold text-2xl shadow-md border border-gold-500/30">
            ॐ
          </div>
        </Link>
        <h2 className="mt-4 font-cinzel text-3xl font-bold tracking-tight text-maroon-900">
          Sign In to Sri Anvaya
        </h2>
        <p className="mt-2 text-xs text-charcoal-800/70 font-serif">
          Access your Customer, Provider, or Administration portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-warmwhite py-8 px-6 sm:px-10 rounded-3xl border border-sand shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenResetModal}
                  className="text-[11px] font-bold text-maroon-700 hover:underline"
                >
                  Forgot / Reset Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="mt-8 pt-6 border-t border-sand">
            <p className="text-[11px] font-bold uppercase tracking-widest text-charcoal-800/60 mb-3 text-center">
              Quick Role Test Logins
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@srianvaya.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors cursor-pointer"
              >
                <span className="font-bold text-maroon-900 block">👑 Admin</span>
                <span className="text-[10px] text-charcoal-800/60">admin@srianvaya.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sundaram.sharma@example.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors cursor-pointer"
              >
                <span className="font-bold text-maroon-900 block">👤 Customer</span>
                <span className="text-[10px] text-charcoal-800/60">sundaram.sharma@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('krishna.vadhyar@srianvaya.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors cursor-pointer"
              >
                <span className="font-bold text-maroon-900 block">🕉️ Vadhyar Provider</span>
                <span className="text-[10px] text-charcoal-800/60">krishna.vadhyar@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('operations@srianvaya.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors cursor-pointer"
              >
                <span className="font-bold text-maroon-900 block">⚙️ Operations</span>
                <span className="text-[10px] text-charcoal-800/60">operations@...</span>
              </button>
            </div>
            <p className="text-[10px] text-charcoal-800/50 text-center mt-2">
              Default password: <code className="font-mono bg-canvas px-1 py-0.5 rounded">SriAnvaya@2026</code>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-charcoal-800/70">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-maroon-700 font-bold hover:underline">
              Plan Your Sradham
            </Link>
          </div>
        </div>
      </div>

      {/* DIRECT PASSWORD RESET MODAL (NO CURRENT PASSWORD REQUIRED) */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Password"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
          <p className="text-charcoal-800/70 text-xs">
            Enter your account email and your new password below. <span className="font-bold text-maroon-900">No old password required.</span>
          </p>

          {resetNotification && (
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
                resetNotification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {resetNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{resetNotification.message}</span>
            </div>
          )}

          <div>
            <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Your Account Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="sundaram.sharma@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-charcoal-800/70 mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-800/40 hover:text-charcoal-800"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Confirm New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-sand">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-sand text-charcoal-800 font-bold hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetLoading}
              className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold shadow-md disabled:opacity-50 cursor-pointer"
            >
              {resetLoading ? 'Resetting...' : 'Set New Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
