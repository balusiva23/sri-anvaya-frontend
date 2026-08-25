import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'Sri Anvaya — Sradham 360 | Honouring Roots. Enriching Generations.',
  description:
    'A premium technology-enabled traditional service management platform combining modern SaaS reliability with authentic Vedic integrity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-canvas min-h-screen text-charcoal-900 antialiased selection:bg-gold-200 selection:text-maroon-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
