'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { apiFetch } from '../../lib/api';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/plans')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlans(data.filter((p: any) => p.isActive));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const displayPlans = plans.length > 0 ? plans : [
    {
      _id: 'plan_ess',
      code: 'ESSENTIAL',
      name: 'Essential Sradham 360',
      monthlyPrice: 1000,
      annualValue: 12000,
      description: 'Foundational recurring plan covering complete annual coordination, Purohith & Dakshina arrangements.',
      inclusions: [
        'Dedicated Family Relationship Manager',
        'Annual Tithi & Calendar Computation',
        '1 Verified Senior Purohith Vadhyar',
        'Standard Samagri List & Coordination',
        'SMS & WhatsApp Prior Reminders',
      ],
      isRecommended: false,
    },
    {
      _id: 'plan_std',
      code: 'STANDARD',
      name: 'Standard Sradham 360',
      monthlyPrice: 1500,
      annualValue: 18000,
      description: 'Most popular all-inclusive traditional service package with complete 4-person ritual team.',
      inclusions: [
        'Everything in Essential Plan',
        'Full 4-Member Ritual Team (1 Purohith + 2 Swamigals + 1 Cook)',
        'Standard Traditional Samagri Kit Delivered',
        'All Provider Dakshinas Handled by Sri Anvaya',
        '12% Provider Welfare Wallet Contribution',
        'Post-Event Ancestral Archana at Srirangam / Kashi',
      ],
      isRecommended: true,
    },
    {
      _id: 'plan_prem',
      code: 'PREMIUM',
      name: 'Premium Heritage Sradham 360',
      monthlyPrice: 2000,
      annualValue: 24000,
      description: 'Comprehensive white-glove concierge management including organic samagri and sacred theertham.',
      inclusions: [
        'Everything in Standard Plan',
        'High-Grade Organic Puja & Cooking Samagri Included',
        'Sacred Ganga & Cauvery Theertham Kit',
        'NRI Family HD Live Video Streaming Link',
        'Priority Rescheduling & Dedicated Concierge',
        'Annual Heritage Archana in 3 Holy Kshetras',
      ],
      isRecommended: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="pt-16 pb-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
            Simple & Transparent Pricing
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-maroon-900 mt-3">
            Sradham 360 Subscription Plans
          </h1>
          <p className="mt-4 text-base sm:text-lg text-charcoal-800/80 font-serif leading-relaxed">
            All-inclusive monthly subscription structures tailored to every family’s custom tradition and sampradayam.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPlans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-warmwhite rounded-3xl p-8 border shadow-sm flex flex-col justify-between relative transition-all ${
                plan.isRecommended
                  ? 'border-2 border-gold-500 shadow-xl md:-translate-y-2'
                  : 'border-sand'
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-500 text-maroon-950 text-[11px] font-extrabold uppercase tracking-widest shadow-md flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Recommended Choice</span>
                </div>
              )}

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${plan.isRecommended ? 'text-gold-700' : 'text-charcoal-800/60'}`}>
                  {plan.code}
                </span>
                <h3 className={`text-2xl font-bold font-serif mt-1 ${plan.isRecommended ? 'text-maroon-900' : 'text-charcoal-900'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className={`text-4xl font-extrabold ${plan.isRecommended ? 'text-maroon-900' : 'text-charcoal-900'}`}>
                    ₹{plan.monthlyPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-charcoal-800/60 ml-2 font-medium">
                    / month (₹{(plan.annualValue || plan.monthlyPrice * 12)?.toLocaleString('en-IN')} annual)
                  </span>
                </div>
                <p className="text-xs text-charcoal-800/70 mt-3 border-b border-sand pb-4">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 text-xs text-charcoal-800">
                  {plan.inclusions?.map((inc: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.isRecommended ? 'text-gold-600' : 'text-emerald-600'}`} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/register?plan=${plan.code}`}
                className={`mt-8 w-full block text-center py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  plan.isRecommended
                    ? 'bg-maroon-700 hover:bg-maroon-800 text-white'
                    : 'bg-sand/60 hover:bg-sand text-charcoal-900'
                }`}
              >
                Select {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
