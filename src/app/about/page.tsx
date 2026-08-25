'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <section className="pt-16 pb-20 bg-warmwhite border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600">
            Our Purpose & Vision
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-maroon-900 mt-3">
            About Sri Anvaya
          </h1>
          <p className="mt-4 text-base sm:text-lg text-charcoal-800/80 font-serif leading-relaxed">
            Preserving ancestral heritage through modern technological stewardship and Vedic integrity.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-warmwhite rounded-3xl p-8 sm:p-12 border border-sand shadow-sm space-y-6">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-maroon-900">
            &quot;Honouring Roots. Enriching Generations.&quot;
          </h2>
          <p className="text-sm sm:text-base text-charcoal-800/80 leading-relaxed font-serif">
            Sri Anvaya was founded on the fundamental principle that our sacred ancestral obligations (Pitru Karma) must be preserved and performed with the highest standards of Vedic precision, transparency, and personal dignity.
          </p>
          <p className="text-sm sm:text-base text-charcoal-800/80 leading-relaxed font-serif">
            As families become geographically dispersed across Indian metropolises and global NRI communities, the logistical friction of organizing traditional rituals has escalated. Sri Anvaya brings the discipline of enterprise SaaS — CRM, automated tithi calendar calculations, logistics, payment management, and provider welfare — to make tradition accessible, dignified, and serene.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-sand">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-maroon-700 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-charcoal-900">Authentic Shastra Compliance</h4>
                <p className="text-xs text-charcoal-800/70 mt-1">Guided by senior scholars across Smartha, Vaishnava, and Madhwa sampradayams.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Heart className="w-6 h-6 text-gold-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-charcoal-900">Vedic Provider Social Security</h4>
                <p className="text-xs text-charcoal-800/70 mt-1">12% welfare fund protecting the healthcare, education, and livelihood of traditional priests.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
