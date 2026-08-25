'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const hasAdminRole = user.roles.some((r: string) =>
          ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'FINANCE', 'CUSTOMER_SUPPORT'].includes(r),
        );
        if (!hasAdminRole) {
          router.push('/customer/dashboard');
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950 text-warmwhite">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-maroon-700 text-gold-400 flex items-center justify-center font-cinzel font-bold text-2xl animate-pulse mx-auto border border-gold-500/30">
            ॐ
          </div>
          <p className="text-xs text-sand/60 font-serif">Loading Sri Anvaya Enterprise Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-canvas text-charcoal-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
