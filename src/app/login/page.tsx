'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                Password
              </label>
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
              className="w-full py-3.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors"
              >
                <span className="font-bold text-maroon-900 block">👑 Admin</span>
                <span className="text-[10px] text-charcoal-800/60">admin@srianvaya.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sundaram.sharma@example.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors"
              >
                <span className="font-bold text-maroon-900 block">👤 Customer</span>
                <span className="text-[10px] text-charcoal-800/60">sundaram.sharma@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('krishna.vadhyar@srianvaya.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors"
              >
                <span className="font-bold text-maroon-900 block">🕉️ Vadhyar Provider</span>
                <span className="text-[10px] text-charcoal-800/60">krishna.vadhyar@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('operations@srianvaya.com')}
                className="p-2 rounded-lg bg-sand/40 hover:bg-sand text-left font-medium transition-colors"
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
    </div>
  );
}
