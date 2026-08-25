'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Heart, Award, ArrowRight, Clock, PackageCheck } from 'lucide-react';

export default function Sradham360Page() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="pt-16 pb-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
            Flagship Vedic Service
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-maroon-900 mt-3">
            Sradham 360™
          </h1>
          <p className="mt-4 text-base sm:text-lg text-charcoal-800/80 font-serif leading-relaxed">
            The complete, dignified, and technology-coordinated annual ancestral service management ecosystem.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600">Vedic Integrity</span>
            <h2 className="font-cinzel text-3xl font-bold text-maroon-900 mt-2">
              Every Detail Reconciled with Precision & Reverence
            </h2>
            <p className="mt-4 text-sm text-charcoal-800/80 leading-relaxed font-serif">
              Ancestral obligations (Pitru Karma) are among the sacred Pancha Maha Yajnas. Modern urban lives and dispersed families often make organizing authentic, orthodox rituals complicated. Sradham 360 solves every aspect while upholding strict Shastraic authenticity.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-warmwhite border border-sand">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Vetted & Learned Purohiths</h4>
                  <p className="text-xs text-charcoal-800/70 mt-1">
                    Veda Patashala-trained scholars with deep mastery in Rig, Yajur, and Sama Veda prayogas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-warmwhite border border-sand">
                <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Authentic Samagri & Madi Kitchen Coordination</h4>
                  <p className="text-xs text-charcoal-800/70 mt-1">
                    Complete ritual kits containing sesame (til), darbha grass, holy waters, ghee, and traditional ingredients delivered on time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-warmwhite border border-sand">
                <Heart className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Transparent Dakshina & 12% Provider Welfare</h4>
                  <p className="text-xs text-charcoal-800/70 mt-1">
                    No awkward negotiations on ritual morning. Sri Anvaya disburses respectable dakshina and reserves 12% for health & retirement protection.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-sm transition-all"
              >
                <span>Enroll in Sradham 360</span>
                <ArrowRight className="w-4 h-4 text-gold-300" />
              </Link>
            </div>
          </div>

          <div className="bg-warmwhite rounded-3xl p-8 border border-sand shadow-xl">
            <h3 className="font-cinzel text-xl font-bold text-maroon-900 mb-6">
              The 4-Member Ritual Team
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">1. Chief Vadhyar (Purohith)</span>
                <p className="text-xs text-charcoal-800/80 mt-1">
                  Conducts the entire sankalpam, homam, and pinda pradanam with exacting Vedic mantras according to your family sampradayam.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">2. Vishwadeva Swamigal</span>
                <p className="text-xs text-charcoal-800/80 mt-1">
                  Vedic scholar representing Vishwadeva deities for the invocation and sacred offerings.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">3. Pitru Swamigal</span>
                <p className="text-xs text-charcoal-800/80 mt-1">
                  Vedic scholar representing Pitru devatas receiving the holy pinda and bhojanam.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-sand">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-700">4. Traditional Madi Cook</span>
                <p className="text-xs text-charcoal-800/80 mt-1">
                  Cooks traditional orthodox prasadam following strict madi and culinary shastra practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
