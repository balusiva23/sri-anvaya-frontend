'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProviderSidebar from '../../components/ProviderSidebar';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-500 text-maroon-900 flex items-center justify-center font-cinzel font-bold text-2xl animate-pulse mx-auto">
            ॐ
          </div>
          <p className="text-xs text-charcoal-800/60 font-serif">Loading Vedic Provider Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-canvas text-charcoal-900">
      <ProviderSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
