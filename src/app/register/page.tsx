'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName,
        email,
        phone,
        password,
        role,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
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
          Begin Your Family Journey
        </h2>
        <p className="mt-2 text-xs text-charcoal-800/70 font-serif">
          Register with Sri Anvaya to plan & coordinate your Sradham ceremonies
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
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    role === 'CUSTOMER'
                      ? 'bg-maroon-700 text-white border-maroon-700'
                      : 'bg-canvas text-charcoal-800 border-sand'
                  }`}
                >
                  Family / Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('PROVIDER')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    role === 'PROVIDER'
                      ? 'bg-maroon-700 text-white border-maroon-700'
                      : 'bg-canvas text-charcoal-800 border-sand'
                  }`}
                >
                  Vedic Provider
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sundaram Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800/70 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98840 12345"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand bg-canvas focus:outline-none focus:ring-2 focus:ring-maroon-700 text-sm"
                />
              </div>
            </div>

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
                  placeholder="sundaram@example.com"
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
              <span>{loading ? 'Creating Account...' : 'Continue to Onboarding'}</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-charcoal-800/70">
            Already have an account?{' '}
            <Link href="/login" className="text-maroon-700 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
