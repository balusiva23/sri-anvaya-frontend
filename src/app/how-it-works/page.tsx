'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Digital Onboarding & Pitru Registry',
      desc: 'Register and input your family lineage, gothram, and ancestors tithi/calendar details. Our Vedic scholars verify the exact calendar dates for the year.',
    },
    {
      num: '02',
      title: 'Choose a Flexible Monthly Plan',
      desc: 'Subscribe to an all-inclusive plan (Essential, Standard, or Premium). Your costs are budgeted comfortably across the year without bulk strain.',
    },
    {
      num: '03',
      title: 'T-Minus 30 & 7 Day Automated Reminders',
      desc: 'You receive timely WhatsApp and email notifications confirming date, timings, venue address, and any specific sampradayam requirements.',
    },
    {
      num: '04',
      title: 'Provider Allocation & Kit Dispatch',
      desc: 'Sri Anvaya assigns 1 Vadhyar, 2 Swamigals, and 1 Madi Cook. All high-grade samagri is dispatched to your residence in advance.',
    },
    {
      num: '05',
      title: 'Event Day Fulfilment & Completion',
      desc: 'The ritual team arrives on time. Ceremonies proceed smoothly with zero commercial friction. You verify completion on your portal.',
    },
    {
      num: '06',
      title: 'Provider Payout & Welfare Ledger',
      desc: 'Dakshina is settled directly to the team, with 12% automatically credited to the providers welfare and healthcare wallet.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="pt-16 pb-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
            Step-by-Step Architecture
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-maroon-900 mt-3">
            How Sri Anvaya Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-charcoal-800/80 font-serif leading-relaxed">
            A frictionless annual operational cycle bringing serenity to traditional ceremonies.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 rounded-2xl bg-warmwhite border border-sand shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-maroon-700 text-gold-300 font-cinzel font-bold text-xl flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-charcoal-900 font-serif">{step.title}</h3>
                <p className="text-sm text-charcoal-800/70 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-base shadow-lg transition-all"
          >
            <span>Start Your Family Onboarding</span>
            <ArrowRight className="w-4 h-4 text-gold-300" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
