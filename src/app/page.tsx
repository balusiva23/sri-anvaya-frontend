'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Users2,
  HeartHandshake,
  CheckCircle2,
  Flame,
  BookOpen,
  Award,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function HomePage() {
  const [plans, setPlans] = React.useState<any[]>([]);

  React.useEffect(() => {
    apiFetch('/plans')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlans(data.filter((p: any) => p.isActive));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const displayPlans = plans.length > 0 ? plans : [
    {
      _id: 'plan_ess',
      code: 'ESSENTIAL',
      name: 'Essential Sradham 360',
      monthlyPrice: 1000,
      annualValue: 12000,
      description: 'Core tithi tracking, Purohith coordination, and dakshina management.',
      inclusions: [
        'Dedicated Family Relationship Manager',
        'Annual Tithi & Calendar Computation',
        '1 Verified Senior Purohith Vadhyar',
        'Standard Samagri List Coordination',
        'WhatsApp & SMS Prior Reminders',
      ],
      isRecommended: false,
    },
    {
      _id: 'plan_std',
      code: 'STANDARD',
      name: 'Standard Sradham 360',
      monthlyPrice: 1500,
      annualValue: 18000,
      description: 'Complete end-to-end management with 4-person ritual team and delivered kit.',
      inclusions: [
        'Full 4-Member Team (Vadhyar + 2 Swamigals + Cook)',
        'Standard Traditional Samagri Kit Delivered',
        'All Provider Dakshinas Handled by Sri Anvaya',
        '12% Provider Welfare Wallet Contribution',
        'Post-Event Ancestral Archana at Srirangam',
      ],
      isRecommended: true,
    },
    {
      _id: 'plan_prem',
      code: 'PREMIUM',
      name: 'Premium Heritage Sradham 360',
      monthlyPrice: 2000,
      annualValue: 24000,
      description: 'White-glove concierge management including organic samagri, sacred theertham, and live streaming.',
      inclusions: [
        'Everything in Standard Plan',
        'High-Grade Organic Puja & Cooking Samagri Included',
        'Sacred Ganga & Cauvery Theertham Kit',
        'NRI Family HD Live Video Streaming Link',
        'Annual Heritage Archana in 3 Holy Kshetras',
      ],
      isRecommended: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-sand">
        {/* Subtle background decorative aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-maroon-100/40 via-gold-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cream border border-gold-400/40 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Introducing Sradham 360 Platform</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold text-maroon-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Honouring Roots.{' '}
            <span className="gold-gradient-text block mt-1">Enriching Generations.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-charcoal-800/80 max-w-2xl mx-auto font-serif leading-relaxed">
            One trusted relationship for planning, coordination and complete fulfilment of important traditional responsibilities.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-base shadow-lg shadow-maroon-900/20 transition-all hover:scale-105"
            >
              <span>Plan Your Sradham</span>
              <ArrowRight className="w-5 h-5 text-gold-300" />
            </Link>

            <Link
              href="/sradham-360"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-warmwhite hover:bg-cream text-maroon-900 font-semibold text-base border border-sand shadow-sm transition-all"
            >
              <span>Explore Sradham 360</span>
            </Link>
          </div>

          {/* Visual Journey Bar */}
          <div className="mt-16 max-w-4xl mx-auto bg-warmwhite/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-sand shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Family & Pitru</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">Vedic calendar & tithi mapping</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Subscription</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">Predictable monthly plan</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">4-Member Team</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">Vadhyar, Swamigals & Cook</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Peace of Mind</h4>
                  <p className="text-xs text-charcoal-800/70 mt-0.5">Zero friction on ritual day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY SRI ANVAYA */}
      <section className="py-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
              The Modern Problem & Sacred Solution
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-maroon-900 mt-2">
              Why Families Choose Sri Anvaya
            </h2>
            <p className="mt-4 text-charcoal-800/70 font-serif leading-relaxed">
              Every year, families struggle with tithi confusion, finding verified Purohiths, arranging orthodox cooks, and managing last-minute financial negotiations. We replace uncertainty with trusted technology and dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-canvas rounded-2xl p-8 border border-sand hover:border-gold-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-maroon-700 text-gold-300 flex items-center justify-center mb-6">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">Vedic Calendar Precision</h3>
              <p className="mt-3 text-sm text-charcoal-800/70 leading-relaxed">
                Automated calculation of Solar, Lunar (Chandramana), and Tithi transitions with timely multi-channel reminders so sacred obligations are never missed.
              </p>
            </div>

            <div className="bg-canvas rounded-2xl p-8 border border-sand hover:border-gold-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-maroon-700 text-gold-300 flex items-center justify-center mb-6">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">Complete 4-Member Team</h3>
              <p className="mt-3 text-sm text-charcoal-800/70 leading-relaxed">
                We coordinate the entire team: 1 verified Senior Purohith, 2 learned Brahmin Swamigals, and 1 authentic Madi cook with all required Samagri delivered to your door.
              </p>
            </div>

            <div className="bg-canvas rounded-2xl p-8 border border-sand hover:border-gold-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-maroon-700 text-gold-300 flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">12% Welfare & Dignity</h3>
              <p className="mt-3 text-sm text-charcoal-800/70 leading-relaxed">
                All Dakshinas are transparently managed. 12% of every event is allocated to our Vedic Provider Welfare Fund for healthcare and family security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLANS & PRICING PREVIEW */}
      <section className="py-20 bg-canvas border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
              Simple & Transparent
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-maroon-900 mt-2">
              Sradham 360 Subscription Plans
            </h2>
            <p className="mt-4 text-charcoal-800/70 font-serif leading-relaxed">
              Spread traditional ceremonial expenses over predictable, peaceful monthly installments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPlans.map((p) => (
              <div
                key={p._id}
                className={`bg-warmwhite rounded-3xl p-8 border shadow-sm flex flex-col justify-between relative transition-all ${
                  p.isRecommended
                    ? 'border-2 border-gold-500 shadow-xl md:-translate-y-2'
                    : 'border-sand'
                }`}
              >
                {p.isRecommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-500 text-maroon-950 text-[11px] font-extrabold uppercase tracking-widest shadow-md">
                    Most Popular & Recommended
                  </div>
                )}

                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${p.isRecommended ? 'text-gold-700' : 'text-charcoal-800/60'}`}>
                    {p.code}
                  </span>
                  <h3 className={`text-2xl font-bold font-serif mt-1 ${p.isRecommended ? 'text-maroon-900' : 'text-charcoal-900'}`}>
                    {p.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className={`text-4xl font-extrabold ${p.isRecommended ? 'text-maroon-900' : 'text-charcoal-900'}`}>
                      ₹{p.monthlyPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-charcoal-800/60 ml-2 font-medium">
                      / month (₹{(p.annualValue || p.monthlyPrice * 12)?.toLocaleString('en-IN')}/yr)
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-800/70 mt-3 border-b border-sand pb-4">
                    {p.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-charcoal-800">
                    {p.inclusions?.map((inc: string, idx: number) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${p.isRecommended ? 'text-gold-600' : 'text-emerald-600'}`} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/register?plan=${p.code}`}
                  className={`mt-8 w-full block text-center py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                    p.isRecommended
                      ? 'bg-maroon-700 hover:bg-maroon-800 text-white'
                      : 'bg-sand/60 hover:bg-sand text-charcoal-900'
                  }`}
                >
                  Choose {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-20 maroon-gradient-bg text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-warmwhite">
            Fulfil Sacred Duties With Complete Serenity.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-sand/80 font-serif max-w-2xl mx-auto leading-relaxed">
            Join hundreds of families who have brought structure, dignity, and peace of mind to their ancestral traditions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-maroon-950 font-bold text-base shadow-xl transition-all hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-base border border-white/20 transition-all"
            >
              Speak to a Relationship Manager
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
